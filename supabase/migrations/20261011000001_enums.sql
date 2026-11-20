-- ============================================================
-- Migration 001 — Custom Enum Types
-- Creates all domain enums used across registration tables.
-- ============================================================

-- User roles matching UserRole in types/index.ts
CREATE TYPE public.user_role AS ENUM (
  'client',
  'landlord',
  'agent',
  'admin'
);

-- Identity / document verification lifecycle
CREATE TYPE public.verification_status AS ENUM (
  'unverified',
  'pending',
  'verified',
  'rejected'
);

-- Property types matching PropertyType in types/index.ts
CREATE TYPE public.property_type AS ENUM (
  'student_lodge',
  'family_apartment',
  'shared_flat',
  'single_room',
  'duplex',
  'villa',
  'short_let'
);

-- Listing lifecycle matching PropertyStatus in types/index.ts
CREATE TYPE public.property_status AS ENUM (
  'available',
  'rented',
  'under_review',
  'inactive'
);

-- Agent commission model matching FeeType in types/index.ts
CREATE TYPE public.fee_type AS ENUM (
  'percentage',
  'flat'
);

-- Rental billing period used on property_listings
CREATE TYPE public.price_period AS ENUM (
  'per_month',
  'per_year',
  'per_night'
);

-- Identity document type (used in identity_verifications)
CREATE TYPE public.id_document_type AS ENUM (
  'nin',
  'international_passport',
  'drivers_license',
  'voters_card'
);
