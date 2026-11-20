-- ============================================================
-- Migration 005 — Row Level Security Policies
-- Covers: profiles, client_profiles, landlord_profiles,
--         agent_profiles, identity_verifications
-- ============================================================

-- ── Helper: is_admin() ────────────────────────────────────
-- Returns true when the calling session belongs to an admin.
-- Used in policies so we avoid repeating the sub-query.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


-- ════════════════════════════════════════════════════════════
-- profiles
-- ════════════════════════════════════════════════════════════

-- Anyone authenticated can read any profile (name, role, avatar)
CREATE POLICY "profiles: authenticated can read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- A user can only update their own profile
CREATE POLICY "profiles: owner can update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any profile (e.g. change verification_status)
CREATE POLICY "profiles: admin can update any"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inserts are handled exclusively by the handle_new_user trigger
-- (service-role context); no authenticated user should INSERT directly.
CREATE POLICY "profiles: insert via trigger only"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Admins can hard-delete profiles (soft-delete preferred in practice)
CREATE POLICY "profiles: admin can delete"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ════════════════════════════════════════════════════════════
-- client_profiles
-- ════════════════════════════════════════════════════════════

-- Clients can read their own detail row; admins can read all
CREATE POLICY "client_profiles: owner or admin can select"
  ON public.client_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Clients can update their own preferences
CREATE POLICY "client_profiles: owner can update"
  ON public.client_profiles FOR UPDATE
  TO authenticated
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any client profile
CREATE POLICY "client_profiles: admin can update any"
  ON public.client_profiles FOR UPDATE
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inserts handled by handle_new_user trigger only
CREATE POLICY "client_profiles: insert via trigger only"
  ON public.client_profiles FOR INSERT
  TO authenticated
  WITH CHECK (false);


-- ════════════════════════════════════════════════════════════
-- landlord_profiles
-- ════════════════════════════════════════════════════════════

-- Landlords can read their own row; admins can read all
CREATE POLICY "landlord_profiles: owner or admin can select"
  ON public.landlord_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Landlords can update their own profile (e.g. bank details flag)
CREATE POLICY "landlord_profiles: owner can update"
  ON public.landlord_profiles FOR UPDATE
  TO authenticated
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any landlord profile (e.g. set identity_verified)
CREATE POLICY "landlord_profiles: admin can update any"
  ON public.landlord_profiles FOR UPDATE
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inserts handled by handle_new_user trigger only
CREATE POLICY "landlord_profiles: insert via trigger only"
  ON public.landlord_profiles FOR INSERT
  TO authenticated
  WITH CHECK (false);


-- ════════════════════════════════════════════════════════════
-- agent_profiles
-- ════════════════════════════════════════════════════════════

-- Agents can read their own row; admins can read all;
-- any authenticated user can view an agent's public-facing columns
-- (agency_name, fee_type, verified_agent) for display on listings.
-- We expose the full row here; sensitive fields (license_number)
-- should be masked at the API layer if needed.
CREATE POLICY "agent_profiles: authenticated can read all"
  ON public.agent_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Agents can update their own profile
CREATE POLICY "agent_profiles: owner can update"
  ON public.agent_profiles FOR UPDATE
  TO authenticated
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any agent profile (e.g. set verified_agent)
CREATE POLICY "agent_profiles: admin can update any"
  ON public.agent_profiles FOR UPDATE
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inserts handled by handle_new_user trigger only
CREATE POLICY "agent_profiles: insert via trigger only"
  ON public.agent_profiles FOR INSERT
  TO authenticated
  WITH CHECK (false);


-- ════════════════════════════════════════════════════════════
-- identity_verifications
-- ════════════════════════════════════════════════════════════

-- Users can see only their own submissions; admins see all
CREATE POLICY "identity_verifications: owner or admin can select"
  ON public.identity_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Users can insert their own verification request
CREATE POLICY "identity_verifications: owner can insert"
  ON public.identity_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Only admins can update (review / approve / reject)
CREATE POLICY "identity_verifications: admin can update"
  ON public.identity_verifications FOR UPDATE
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users can delete their own pending submission (withdraw);
-- admins can delete any (e.g. spam / fraudulent docs)
CREATE POLICY "identity_verifications: owner can delete pending"
  ON public.identity_verifications FOR DELETE
  TO authenticated
  USING (
    (user_id = auth.uid() AND status = 'pending')
    OR public.is_admin()
  );
