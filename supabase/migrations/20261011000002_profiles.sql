-- ============================================================
-- Migration 002 — profiles table
-- Central user profile record, one row per auth.users entry.
-- Stores shared fields for all roles; role-specific detail
-- tables are created in migration 003.
-- ============================================================

CREATE TABLE public.profiles (
  -- Primary key mirrors auth.users.id (UUID from Supabase Auth)
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core identity (captured in Step 3 of the register form)
  email           text        NOT NULL,
  full_name       text        NOT NULL CHECK (char_length(full_name) >= 2),
  phone           text,
  avatar_url      text,

  -- Role & verification (set during registration Step 1)
  role            public.user_role         NOT NULL DEFAULT 'client',
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',

  -- Timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────
CREATE UNIQUE INDEX profiles_email_idx ON public.profiles (email);
CREATE INDEX profiles_role_idx         ON public.profiles (role);
CREATE INDEX profiles_verification_idx ON public.profiles (verification_status);

-- ── updated_at auto-refresh trigger ───────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Enable RLS (policies added in migration 005) ──────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.profiles IS
  'One profile per auth.users entry. Shared fields for all roles; role-specific data lives in client_profiles / landlord_profiles / agent_profiles.';
