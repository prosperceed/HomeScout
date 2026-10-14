-- ============================================================
-- Migration 003 — Role-specific profile detail tables
-- Each table extends profiles (1-to-1) for a specific role.
-- Data collected in registration Step 2 per role.
-- ============================================================

-- ── client_profiles ────────────────────────────────────────
-- Populated from ClientRegistrationData / ClientRoleData
CREATE TABLE public.client_profiles (
  -- 1-to-1 with profiles; cascades on profile delete
  id                      uuid        PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Location preference (Step 2 – client form)
  target_state            text,
  target_locality         text,

  -- Housing preferences (Step 2 – client form)
  preferred_property_types public.property_type[] NOT NULL DEFAULT '{}',
  budget_min              numeric(12, 2),
  budget_max              numeric(12, 2),

  -- Derived convenience columns (maintained by triggers / app logic)
  saved_properties_count  integer NOT NULL DEFAULT 0,

  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX client_profiles_target_state_idx ON public.client_profiles (target_state);
CREATE INDEX client_profiles_budget_max_idx   ON public.client_profiles (budget_max);

CREATE TRIGGER client_profiles_set_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.client_profiles IS
  'Tenant/client-specific registration data: location preferences, budget, and property type filters.';


-- ── landlord_profiles ──────────────────────────────────────
-- Populated from LandlordRegistrationData / LandlordRoleData
CREATE TABLE public.landlord_profiles (
  id                          uuid        PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Property portfolio (Step 2 – landlord form)
  -- Stored as text to preserve "10+" range input; cast as needed
  property_count_range        text        NOT NULL DEFAULT '1'
                              CHECK (property_count_range IN ('1', '2-3', '4-9', '10+')),

  -- True once the landlord has uploaded a valid government ID
  identity_verified           boolean     NOT NULL DEFAULT false,

  -- Flagged true at registration if they clicked "ready for verification"
  identity_verification_ready boolean     NOT NULL DEFAULT false,

  -- Populated after admin approves the document upload
  nin_or_passport_ref         text,       -- storage object path, NOT the raw ID number

  -- True once bank account / payout details are added
  bank_details_added          boolean     NOT NULL DEFAULT false,

  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER landlord_profiles_set_updated_at
  BEFORE UPDATE ON public.landlord_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.landlord_profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.landlord_profiles IS
  'Landlord-specific registration data: property portfolio size, identity verification state, and payout readiness.';


-- ── agent_profiles ─────────────────────────────────────────
-- Populated from AgentRegistrationData / AgentRoleData
CREATE TABLE public.agent_profiles (
  id                  uuid        PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Agency & license (Step 2 – agent form)
  agency_name         text,
  license_number      text        NOT NULL,

  -- Commission model (Step 2 – agent form)
  fee_type            public.fee_type    NOT NULL DEFAULT 'percentage',
  fee_value           numeric(12, 2)     NOT NULL DEFAULT 10
                      CHECK (fee_value >= 0),

  -- Set true after admin verifies the agency license
  verified_agent      boolean            NOT NULL DEFAULT false,

  -- Count of listings currently managed by this agent
  managed_listings_count integer         NOT NULL DEFAULT 0,

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX agent_profiles_license_idx ON public.agent_profiles (license_number);

CREATE TRIGGER agent_profiles_set_updated_at
  BEFORE UPDATE ON public.agent_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.agent_profiles IS
  'Agent/broker-specific registration data: agency name, license number, commission model, and verification status.';
