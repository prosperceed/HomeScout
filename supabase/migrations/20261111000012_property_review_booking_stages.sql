-- ============================================================
-- Migration 012: Property Under Review & Booking Stages
-- Tracks property lifecycle through chat references, physical
-- inspection verification, and secure payment completion.
-- ============================================================

-- 1. Extend bookings table with inspection and payment tracking columns
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'inquiry',
  ADD COLUMN IF NOT EXISTS physical_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS physical_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verification_checklist jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS payment_amount numeric(14, 2),
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS inspection_notes text;

CREATE INDEX IF NOT EXISTS bookings_stage_idx ON public.bookings (stage);
CREATE INDEX IF NOT EXISTS bookings_payment_status_idx ON public.bookings (payment_status);

-- 2. Enhanced trigger function to synchronize property status on booking changes
CREATE OR REPLACE FUNCTION public.sync_property_status_on_booking()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_other_active_exists boolean;
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE public.property_listings
    SET status = 'rented', updated_at = now()
    WHERE id = NEW.property_id;
  ELSIF NEW.status IN ('pending', 'viewing', 'approved') THEN
    UPDATE public.property_listings
    SET status = 'under_review', updated_at = now()
    WHERE id = NEW.property_id AND status = 'available';
  ELSIF NEW.status IN ('rejected', 'cancelled') THEN
    -- Check if another active booking exists for this property
    SELECT EXISTS (
      SELECT 1 FROM public.bookings
      WHERE property_id = NEW.property_id
        AND id <> NEW.id
        AND status IN ('pending', 'viewing', 'approved')
    ) INTO v_other_active_exists;

    IF NOT v_other_active_exists THEN
      UPDATE public.property_listings
      SET status = 'available', updated_at = now()
      WHERE id = NEW.property_id AND status = 'under_review';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_sync_property_status ON public.bookings;
CREATE TRIGGER bookings_sync_property_status
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.sync_property_status_on_booking();

-- 3. Update handle_new_chat_message to auto-set under_review and ensure booking exists
CREATE OR REPLACE FUNCTION public.handle_new_chat_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_p1 uuid;
  v_p2 uuid;
  v_conv_id uuid;
  v_sender_name text;
  v_recent_notif_exists boolean;
  v_client_id uuid;
  v_agent_id uuid;
  v_booking_id uuid;
  v_prop_price numeric(14, 2);
  v_prop_period public.price_period;
  v_prop_agent uuid;
  v_prop_owner uuid;
  v_sender_role public.user_role;
  v_recip_role public.user_role;
BEGIN
  v_p1 := LEAST(NEW.sender_id, NEW.recipient_id);
  v_p2 := GREATEST(NEW.sender_id, NEW.recipient_id);

  -- If message references a property, update property status to under_review
  IF NEW.property_id IS NOT NULL THEN
    UPDATE public.property_listings
    SET status = 'under_review', updated_at = now()
    WHERE id = NEW.property_id AND status = 'available';

    -- Determine which participant is the client
    SELECT role INTO v_sender_role FROM public.profiles WHERE id = NEW.sender_id;
    SELECT role INTO v_recip_role FROM public.profiles WHERE id = NEW.recipient_id;

    IF v_sender_role = 'client' THEN
      v_client_id := NEW.sender_id;
      v_agent_id := NEW.recipient_id;
    ELSIF v_recip_role = 'client' THEN
      v_client_id := NEW.recipient_id;
      v_agent_id := NEW.sender_id;
    END IF;

    -- If client exists, check or create active booking
    IF v_client_id IS NOT NULL THEN
      SELECT id INTO v_booking_id
      FROM public.bookings
      WHERE property_id = NEW.property_id AND client_id = v_client_id
        AND status NOT IN ('rejected', 'cancelled', 'completed')
      LIMIT 1;

      IF v_booking_id IS NULL THEN
        SELECT price, price_period, agent_id, owner_id
        INTO v_prop_price, v_prop_period, v_prop_agent, v_prop_owner
        FROM public.property_listings
        WHERE id = NEW.property_id;

        INSERT INTO public.bookings (
          property_id,
          client_id,
          agent_id,
          status,
          price_at_booking,
          price_period,
          stage
        ) VALUES (
          NEW.property_id,
          v_client_id,
          COALESCE(v_agent_id, v_prop_agent, v_prop_owner),
          'pending',
          COALESCE(v_prop_price, 0),
          COALESCE(v_prop_period, 'per_year'),
          'inquiry'
        ) RETURNING id INTO v_booking_id;
      END IF;

      IF NEW.booking_id IS NULL THEN
        NEW.booking_id := v_booking_id;
      END IF;
    END IF;
  END IF;

  INSERT INTO public.conversations (
    participant_one_id,
    participant_two_id,
    property_id,
    booking_id,
    last_message_id,
    last_message_body,
    last_message_sender_id,
    last_message_at,
    participant_one_unread,
    participant_two_unread,
    updated_at
  )
  VALUES (
    v_p1,
    v_p2,
    NEW.property_id,
    NEW.booking_id,
    NEW.id,
    LEFT(NEW.body, 240),
    NEW.sender_id,
    NEW.created_at,
    CASE WHEN NEW.recipient_id = v_p1 THEN 1 ELSE 0 END,
    CASE WHEN NEW.recipient_id = v_p2 THEN 1 ELSE 0 END,
    NEW.created_at
  )
  ON CONFLICT (
    LEAST(participant_one_id, participant_two_id),
    GREATEST(participant_one_id, participant_two_id),
    COALESCE(property_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  DO UPDATE SET
    last_message_id = EXCLUDED.last_message_id,
    last_message_body = EXCLUDED.last_message_body,
    last_message_sender_id = EXCLUDED.last_message_sender_id,
    last_message_at = EXCLUDED.last_message_at,
    booking_id = COALESCE(public.conversations.booking_id, EXCLUDED.booking_id),
    participant_one_unread = CASE
      WHEN NEW.recipient_id = public.conversations.participant_one_id
      THEN public.conversations.participant_one_unread + 1
      ELSE public.conversations.participant_one_unread
    END,
    participant_two_unread = CASE
      WHEN NEW.recipient_id = public.conversations.participant_two_id
      THEN public.conversations.participant_two_unread + 1
      ELSE public.conversations.participant_two_unread
    END,
    updated_at = EXCLUDED.updated_at
  RETURNING id INTO v_conv_id;

  IF NEW.conversation_id IS NULL THEN
    NEW.conversation_id := v_conv_id;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = NEW.recipient_id
      AND type = 'new_message'
      AND is_read = false
      AND created_at > (now() - interval '5 minutes')
  ) INTO v_recent_notif_exists;

  IF NOT v_recent_notif_exists THEN
    SELECT COALESCE(full_name, 'A user') INTO v_sender_name
    FROM public.profiles
    WHERE id = NEW.sender_id;

    INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
    VALUES (
      NEW.recipient_id,
      'new_message',
      'New message from ' || v_sender_name,
      LEFT(NEW.body, 140),
      NEW.id,
      'messages'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 4. RPC to reference property inquiry when chat opens with property_id
CREATE OR REPLACE FUNCTION public.reference_property_inquiry(
  p_property_id uuid,
  p_partner_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid;
  v_client_id uuid;
  v_agent_id uuid;
  v_booking_id uuid;
  v_prop_price numeric(14, 2);
  v_prop_period public.price_period;
  v_prop_agent uuid;
  v_prop_owner uuid;
  v_user_role public.user_role;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT role INTO v_user_role FROM public.profiles WHERE id = v_uid;

  IF v_user_role = 'client' THEN
    v_client_id := v_uid;
    v_agent_id := p_partner_id;
  ELSE
    v_client_id := p_partner_id;
    v_agent_id := v_uid;
  END IF;

  SELECT price, price_period, agent_id, owner_id
  INTO v_prop_price, v_prop_period, v_prop_agent, v_prop_owner
  FROM public.property_listings
  WHERE id = p_property_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Update property status to under_review
  UPDATE public.property_listings
  SET status = 'under_review', updated_at = now()
  WHERE id = p_property_id AND status = 'available';

  -- Check or create booking
  IF v_client_id IS NOT NULL THEN
    SELECT id INTO v_booking_id
    FROM public.bookings
    WHERE property_id = p_property_id AND client_id = v_client_id
      AND status NOT IN ('rejected', 'cancelled', 'completed')
    LIMIT 1;

    IF v_booking_id IS NULL THEN
      INSERT INTO public.bookings (
        property_id,
        client_id,
        agent_id,
        status,
        price_at_booking,
        price_period,
        stage
      ) VALUES (
        p_property_id,
        v_client_id,
        COALESCE(v_agent_id, v_prop_agent, v_prop_owner),
        'pending',
        COALESCE(v_prop_price, 0),
        COALESCE(v_prop_period, 'per_year'),
        'inquiry'
      ) RETURNING id INTO v_booking_id;
    END IF;
  END IF;

  RETURN v_booking_id;
END;
$$;

-- 5. RPC to schedule property inspection
CREATE OR REPLACE FUNCTION public.schedule_property_inspection(
  p_booking_id uuid,
  p_viewing_date timestamptz,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking record;
  v_client_name text;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
  END IF;

  IF auth.uid() <> v_booking.client_id AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  UPDATE public.bookings
  SET
    status = 'viewing',
    stage = 'inspection',
    viewing_date = p_viewing_date,
    inspection_notes = COALESCE(p_notes, inspection_notes),
    updated_at = now()
  WHERE id = p_booking_id;

  -- Notify agent / landlord
  SELECT full_name INTO v_client_name FROM public.profiles WHERE id = v_booking.client_id;

  IF v_booking.agent_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
    VALUES (
      v_booking.agent_id,
      'booking_request',
      'Inspection Scheduled',
      COALESCE(v_client_name, 'A client') || ' scheduled a physical inspection for ' || to_char(p_viewing_date, 'Mon DD, YYYY at HH12:MI AM'),
      p_booking_id,
      'bookings'
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'booking_id', p_booking_id);
END;
$$;

-- 6. RPC to confirm physical verification
CREATE OR REPLACE FUNCTION public.confirm_physical_verification(
  p_booking_id uuid,
  p_checklist jsonb,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking record;
  v_client_name text;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
  END IF;

  IF auth.uid() <> v_booking.client_id AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  UPDATE public.bookings
  SET
    status = 'approved',
    stage = 'verified',
    physical_verified = true,
    physical_verified_at = now(),
    verification_checklist = p_checklist,
    inspection_notes = COALESCE(p_notes, inspection_notes),
    updated_at = now()
  WHERE id = p_booking_id;

  SELECT full_name INTO v_client_name FROM public.profiles WHERE id = v_booking.client_id;

  IF v_booking.agent_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
    VALUES (
      v_booking.agent_id,
      'booking_approved',
      'Physical Inspection Verified',
      COALESCE(v_client_name, 'The client') || ' confirmed physical inspection of the property. Payment is now unlocked.',
      p_booking_id,
      'bookings'
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'booking_id', p_booking_id);
END;
$$;

-- 7. RPC to complete booking payment
CREATE OR REPLACE FUNCTION public.complete_booking_payment(
  p_booking_id uuid,
  p_payment_ref text,
  p_amount numeric,
  p_method text DEFAULT 'card'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking record;
  v_client_name text;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
  END IF;

  IF auth.uid() <> v_booking.client_id AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Security check: Physical inspection must be confirmed before payment
  IF NOT v_booking.physical_verified THEN
    RETURN jsonb_build_object('success', false, 'error', 'Physical inspection verification is required before payment can proceed.');
  END IF;

  UPDATE public.bookings
  SET
    status = 'completed',
    stage = 'completed',
    payment_status = 'paid',
    payment_reference = p_payment_ref,
    payment_amount = p_amount,
    paid_at = now(),
    payment_method = p_method,
    updated_at = now()
  WHERE id = p_booking_id;

  -- Property status automatically flips to 'rented' via sync_property_status_on_booking()
  UPDATE public.property_listings
  SET status = 'rented', updated_at = now()
  WHERE id = v_booking.property_id;

  SELECT full_name INTO v_client_name FROM public.profiles WHERE id = v_booking.client_id;

  IF v_booking.agent_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
    VALUES (
      v_booking.agent_id,
      'booking_approved',
      'Rent Payment Received',
      COALESCE(v_client_name, 'Client') || ' has completed payment of ₦' || to_char(p_amount, 'FM999,999,999') || ' for the property. Deal closed!',
      p_booking_id,
      'bookings'
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'booking_id', p_booking_id, 'payment_reference', p_payment_ref);
END;
$$;

-- 8. Enable client updates on their own active bookings
DROP POLICY IF EXISTS "bookings: client can update own booking" ON public.bookings;
CREATE POLICY "bookings: client can update own booking"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- 9. Update property_listings policies so under_review and rented properties remain visible
DROP POLICY IF EXISTS "property_listings: anyone can read available" ON public.property_listings;
CREATE POLICY "property_listings: anyone can read active or under review"
  ON public.property_listings FOR SELECT
  USING (status IN ('available', 'under_review', 'rented') OR owner_id = auth.uid() OR public.is_admin());

-- Allow authenticated participants to set status to under_review during inquiry
DROP POLICY IF EXISTS "property_listings: users can mark under review on inquiry" ON public.property_listings;
CREATE POLICY "property_listings: users can mark under review on inquiry"
  ON public.property_listings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (status = 'under_review' OR owner_id = auth.uid() OR public.is_admin());
