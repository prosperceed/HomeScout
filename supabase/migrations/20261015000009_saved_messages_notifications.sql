CREATE TABLE public.saved_properties (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id  uuid        NOT NULL REFERENCES public.property_listings(id) ON DELETE CASCADE,
  saved_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT saved_properties_unique UNIQUE (client_id, property_id)
);

CREATE INDEX saved_properties_client_idx   ON public.saved_properties (client_id);
CREATE INDEX saved_properties_property_idx ON public.saved_properties (property_id);

CREATE OR REPLACE FUNCTION public.sync_saved_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.client_profiles
    SET saved_properties_count = saved_properties_count + 1
    WHERE id = NEW.client_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.client_profiles
    SET saved_properties_count = GREATEST(0, saved_properties_count - 1)
    WHERE id = OLD.client_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER saved_properties_sync_count
  AFTER INSERT OR DELETE ON public.saved_properties
  FOR EACH ROW EXECUTE FUNCTION public.sync_saved_count();

ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_properties: owner can select"
  ON public.saved_properties FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "saved_properties: owner can insert"
  ON public.saved_properties FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "saved_properties: owner can delete"
  ON public.saved_properties FOR DELETE
  TO authenticated
  USING (client_id = auth.uid());


CREATE TABLE public.messages (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  booking_id     uuid        REFERENCES public.bookings(id) ON DELETE CASCADE,
  property_id    uuid        REFERENCES public.property_listings(id) ON DELETE SET NULL,

  sender_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  body           text        NOT NULL CHECK (char_length(body) >= 1),
  is_read        boolean     NOT NULL DEFAULT false,

  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_sender_idx    ON public.messages (sender_id);
CREATE INDEX messages_recipient_idx ON public.messages (recipient_id);
CREATE INDEX messages_booking_idx   ON public.messages (booking_id);
CREATE INDEX messages_created_idx   ON public.messages (created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages: participant can select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "messages: sender can insert"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages: recipient can mark read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "messages: admin can select all"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.is_admin());


CREATE TYPE public.notification_type AS ENUM (
  'booking_request',
  'booking_approved',
  'booking_rejected',
  'booking_cancelled',
  'new_message',
  'listing_verified',
  'listing_flagged'
);

CREATE TABLE public.notifications (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type          public.notification_type NOT NULL,
  title         text        NOT NULL,
  body          text,
  is_read       boolean     NOT NULL DEFAULT false,
  reference_id  uuid,
  reference_table text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_idx    ON public.notifications (user_id);
CREATE INDEX notifications_unread_idx  ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX notifications_created_idx ON public.notifications (created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: owner can select"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications: owner can mark read"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications: system can insert"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.notify_on_booking_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_property_title  text;
  v_owner_id        uuid;
BEGIN
  SELECT title, owner_id INTO v_property_title, v_owner_id
  FROM public.property_listings
  WHERE id = NEW.property_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
    VALUES (
      v_owner_id,
      'booking_request',
      'New booking request',
      'A client has requested to view ' || v_property_title,
      NEW.id,
      'bookings'
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
      VALUES (
        NEW.client_id,
        'booking_approved',
        'Your booking was approved',
        v_property_title || ' — your viewing request has been approved.',
        NEW.id,
        'bookings'
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, type, title, body, reference_id, reference_table)
      VALUES (
        NEW.client_id,
        'booking_rejected',
        'Booking not approved',
        v_property_title || ' — your request was not approved at this time.',
        NEW.id,
        'bookings'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_notify
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_booking_change();
