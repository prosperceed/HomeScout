-- ============================================================
-- Migration 006 — handle_new_user trigger
-- Fires AFTER INSERT on auth.users (via Supabase Auth).
-- Reads user_metadata set during supabase.auth.signUp() and
-- creates the appropriate rows in:
--   profiles, client_profiles | landlord_profiles | agent_profiles
--
-- Metadata keys written by app/register/page.tsx:
--   full_name, phone, role,
--   + role-specific keys (see below per role)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as postgres, bypasses RLS insert block
SET search_path = public
AS $$
DECLARE
  v_role            public.user_role;
  v_full_name       text;
  v_phone           text;
BEGIN
  -- ── Extract shared metadata ──────────────────────────────
  v_role       := COALESCE(
                    (NEW.raw_user_meta_data->>'role')::public.user_role,
                    'client'
                  );
  v_full_name  := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_phone      := NEW.raw_user_meta_data->>'phone';

  -- ── 1. Insert base profile ───────────────────────────────
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    verification_status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_phone,
    v_role,
    'unverified',
    now(),
    now()
  );

  -- ── 2. Insert role-specific detail row ───────────────────

  IF v_role = 'client' THEN
    -- Metadata keys: target_state, target_locality,
    --                preferred_property_types (JSON array), budget_max
    INSERT INTO public.client_profiles (
      id,
      target_state,
      target_locality,
      preferred_property_types,
      budget_max,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'target_state',
      NEW.raw_user_meta_data->>'target_locality',
      COALESCE(
        ARRAY(
          SELECT jsonb_array_elements_text(
            NEW.raw_user_meta_data->'preferred_property_types'
          )
        )::public.property_type[],
        '{}'
      ),
      NULLIF(NEW.raw_user_meta_data->>'budget_max', '')::numeric,
      now(),
      now()
    );

  ELSIF v_role = 'landlord' THEN
    -- Metadata keys: property_count (string "1"/"2-3"/"4-9"/"10+"),
    --                identity_verification_ready (boolean string)
    INSERT INTO public.landlord_profiles (
      id,
      property_count_range,
      identity_verification_ready,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'property_count', '1'),
      COALESCE(
        (NEW.raw_user_meta_data->>'identity_verification_ready')::boolean,
        false
      ),
      now(),
      now()
    );

  ELSIF v_role = 'agent' THEN
    -- Metadata keys: agency_name, license_number,
    --                fee_type, fee_value (numeric string)
    INSERT INTO public.agent_profiles (
      id,
      agency_name,
      license_number,
      fee_type,
      fee_value,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'agency_name',
      COALESCE(NEW.raw_user_meta_data->>'license_number', ''),
      COALESCE(
        (NEW.raw_user_meta_data->>'fee_type')::public.fee_type,
        'percentage'
      ),
      COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'fee_value', '')::numeric,
        10
      ),
      now(),
      now()
    );

  ELSIF v_role = 'admin' THEN
    -- Admins are created by other admins / seed scripts;
    -- no extra detail table required at registration time.
    NULL;

  END IF;

  RETURN NEW;
END;
$$;

-- ── Attach the trigger to auth.users ─────────────────────
-- Supabase creates auth.users in the auth schema.
-- The trigger runs once per new signup.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS
  'Fires after every new Supabase Auth signup. Creates a profiles row and the matching role-specific detail row (client_profiles / landlord_profiles / agent_profiles) from user_metadata submitted during registration.';
