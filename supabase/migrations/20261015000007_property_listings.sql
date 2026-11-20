CREATE TYPE public.listing_tag AS ENUM (
  'for_sale',
  'for_rent',
  'shortlet'
);

CREATE TABLE public.property_listings (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  title             text          NOT NULL CHECK (char_length(title) >= 4),
  description       text,
  type              public.property_type  NOT NULL,
  status            public.property_status NOT NULL DEFAULT 'available',
  listing_tag       public.listing_tag    NOT NULL,

  price             numeric(14, 2) NOT NULL CHECK (price > 0),
  price_period      public.price_period   NOT NULL DEFAULT 'per_year',

  bedrooms          smallint      NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms         smallint      NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),

  images            jsonb         NOT NULL DEFAULT '[]',
  amenities         text[]        NOT NULL DEFAULT '{}',

  lat               numeric(10, 7),
  lng               numeric(10, 7),
  formatted_address text,
  state             text,
  local_government  text,
  city              text,

  is_verified       boolean       NOT NULL DEFAULT false,
  is_featured       boolean       NOT NULL DEFAULT false,
  views_count       integer       NOT NULL DEFAULT 0,

  owner_id          uuid          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_type        text          NOT NULL CHECK (owner_type IN ('landlord', 'agent')),
  agent_id          uuid          REFERENCES public.agent_profiles(id) ON DELETE SET NULL,

  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX property_listings_owner_idx      ON public.property_listings (owner_id);
CREATE INDEX property_listings_agent_idx      ON public.property_listings (agent_id);
CREATE INDEX property_listings_status_idx     ON public.property_listings (status);
CREATE INDEX property_listings_tag_idx        ON public.property_listings (listing_tag);
CREATE INDEX property_listings_type_idx       ON public.property_listings (type);
CREATE INDEX property_listings_state_idx      ON public.property_listings (state);
CREATE INDEX property_listings_featured_idx   ON public.property_listings (is_featured) WHERE is_featured = true;
CREATE INDEX property_listings_created_idx    ON public.property_listings (created_at DESC);

CREATE TRIGGER property_listings_set_updated_at
  BEFORE UPDATE ON public.property_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.sync_agent_listing_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.agent_id IS NOT NULL THEN
    UPDATE public.agent_profiles
    SET managed_listings_count = managed_listings_count + 1
    WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.agent_id IS NOT NULL THEN
    UPDATE public.agent_profiles
    SET managed_listings_count = GREATEST(0, managed_listings_count - 1)
    WHERE id = OLD.agent_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.agent_id IS DISTINCT FROM NEW.agent_id THEN
      IF OLD.agent_id IS NOT NULL THEN
        UPDATE public.agent_profiles
        SET managed_listings_count = GREATEST(0, managed_listings_count - 1)
        WHERE id = OLD.agent_id;
      END IF;
      IF NEW.agent_id IS NOT NULL THEN
        UPDATE public.agent_profiles
        SET managed_listings_count = managed_listings_count + 1
        WHERE id = NEW.agent_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER property_listings_sync_agent_count
  AFTER INSERT OR UPDATE OR DELETE ON public.property_listings
  FOR EACH ROW EXECUTE FUNCTION public.sync_agent_listing_count();

ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_listings: anyone can read available"
  ON public.property_listings FOR SELECT
  USING (status = 'available' OR owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "property_listings: owner can insert"
  ON public.property_listings FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "property_listings: owner can update"
  ON public.property_listings FOR UPDATE
  TO authenticated
  USING  (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "property_listings: admin can update any"
  ON public.property_listings FOR UPDATE
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "property_listings: owner can delete"
  ON public.property_listings FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin());
