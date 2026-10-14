-- ============================================================
-- Migration 004 — identity_verifications table
-- Tracks document upload and admin review lifecycle for
-- landlords and agents who need a verified badge.
-- Referenced in PRODUCT_TODOS #11 (Identity verification).
-- ============================================================

CREATE TABLE public.identity_verifications (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The profile requesting verification (landlord or agent)
  user_id         uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Document details
  document_type   public.id_document_type NOT NULL,

  -- Path to the uploaded file in Supabase Storage (never expose raw ID)
  document_url    text        NOT NULL,

  -- Optional secondary document (e.g. utility bill for address proof)
  secondary_document_url text,

  -- Verification lifecycle
  status          public.verification_status NOT NULL DEFAULT 'pending',

  -- Admin who reviewed the submission (null until reviewed)
  reviewed_by     uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,

  -- Free-text note from the admin (rejection reason, etc.)
  admin_notes     text,

  submitted_at    timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX identity_verifications_user_idx   ON public.identity_verifications (user_id);
CREATE INDEX identity_verifications_status_idx ON public.identity_verifications (status);

-- Allow only one active (pending/verified) submission per user at a time.
-- Rejected ones are kept for audit; a new submission creates a fresh row.
CREATE UNIQUE INDEX identity_verifications_active_user_idx
  ON public.identity_verifications (user_id)
  WHERE status IN ('pending', 'verified');

-- ── updated_at trigger ────────────────────────────────────
CREATE TRIGGER identity_verifications_set_updated_at
  BEFORE UPDATE ON public.identity_verifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Sync verification_status back to profiles ─────────────
-- When an admin approves or rejects, mirror the status onto
-- the profile row so queries don't need a join.
CREATE OR REPLACE FUNCTION public.sync_verification_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    UPDATE public.profiles
    SET    verification_status = NEW.status
    WHERE  id = NEW.user_id;

    -- Also flip identity_verified on landlord_profiles
    IF NEW.status = 'verified' THEN
      UPDATE public.landlord_profiles
      SET    identity_verified = true
      WHERE  id = NEW.user_id;

      UPDATE public.agent_profiles
      SET    verified_agent = true
      WHERE  id = NEW.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER identity_verifications_sync_status
  AFTER UPDATE ON public.identity_verifications
  FOR EACH ROW EXECUTE FUNCTION public.sync_verification_status();

-- ── Enable RLS ────────────────────────────────────────────
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.identity_verifications IS
  'Document submissions for landlord/agent identity verification. Status changes are mirrored onto profiles.verification_status.';
