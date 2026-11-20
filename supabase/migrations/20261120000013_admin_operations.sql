ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS platform_fee numeric(14, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS escrow_status text NOT NULL DEFAULT 'not_started'
    CHECK (escrow_status IN ('not_started', 'queued', 'held', 'released', 'refunded'));

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  region text,
  country text,
  city text,
  path text,
  source text,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_occurred_idx ON public.analytics_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_region_idx ON public.analytics_events(region, occurred_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics events are server managed" ON public.analytics_events FOR ALL TO service_role USING (true) WITH CHECK (true);
