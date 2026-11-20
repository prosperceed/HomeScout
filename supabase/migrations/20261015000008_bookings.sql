CREATE TYPE public.booking_status AS ENUM (
  'pending',
  'approved',
  'viewing',
  'rejected',
  'cancelled',
  'completed'
);

CREATE TABLE public.bookings (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id     uuid          NOT NULL REFERENCES public.property_listings(id) ON DELETE CASCADE,
  client_id       uuid          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id        uuid          REFERENCES public.profiles(id) ON DELETE SET NULL,

  status          public.booking_status NOT NULL DEFAULT 'pending',

  message         text,
  viewing_date    timestamptz,
  move_in_date    date,

  price_at_booking numeric(14, 2) NOT NULL,
  price_period     public.price_period  NOT NULL,

  admin_notes     text,
  reviewed_by     uuid          REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,

  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX bookings_client_idx    ON public.bookings (client_id);
CREATE INDEX bookings_agent_idx     ON public.bookings (agent_id);
CREATE INDEX bookings_property_idx  ON public.bookings (property_id);
CREATE INDEX bookings_status_idx    ON public.bookings (status);
CREATE INDEX bookings_created_idx   ON public.bookings (created_at DESC);

CREATE UNIQUE INDEX bookings_active_client_property_idx
  ON public.bookings (client_id, property_id)
  WHERE status NOT IN ('rejected', 'cancelled', 'completed');

CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.sync_property_status_on_booking()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE public.property_listings
    SET status = 'rented'
    WHERE id = NEW.property_id;
  ELSIF NEW.status IN ('rejected', 'cancelled')
    AND OLD.status = 'completed' THEN
    UPDATE public.property_listings
    SET status = 'available'
    WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_sync_property_status
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.sync_property_status_on_booking();

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings: client sees own"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "bookings: agent sees assigned"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "bookings: property owner sees all for their listing"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.property_listings pl
      WHERE pl.id = bookings.property_id
        AND pl.owner_id = auth.uid()
    )
  );

CREATE POLICY "bookings: admin sees all"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "bookings: client can insert"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "bookings: client can cancel own pending"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid() AND status = 'pending')
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "bookings: agent or owner can update status"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    agent_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.property_listings pl
      WHERE pl.id = bookings.property_id AND pl.owner_id = auth.uid()
    )
    OR public.is_admin()
  );
