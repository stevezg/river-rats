-- ============================================================
-- River Rats — Initial Schema (SUR-21)
-- ============================================================

-- ------------------------------------------------------------
-- Helper: updated_at trigger function
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- 1. profiles
-- ------------------------------------------------------------
CREATE TABLE public.profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         text UNIQUE NOT NULL,
  display_name     text NOT NULL,
  skill_level      text NOT NULL CHECK (skill_level IN ('I-II','III','III-IV','IV','IV-V','V','V+')),
  home_river_slug  text,
  bio              text,
  avatar_url       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 2. trips
-- ------------------------------------------------------------
CREATE TABLE public.trips (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  river_slug       text NOT NULL,
  river_name       text NOT NULL,
  date             date NOT NULL,
  time             text NOT NULL,
  meeting_point    text NOT NULL,
  notes            text,
  min_skill        text NOT NULL CHECK (min_skill IN ('I-II','III','III-IV','IV','IV-V','V','V+')),
  total_spots      int  NOT NULL CHECK (total_spots BETWEEN 1 AND 20),
  spots_remaining  int  NOT NULL CHECK (spots_remaining >= 0),
  status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open','full','cancelled','completed')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 3. trip_members
-- ------------------------------------------------------------
CREATE TABLE public.trip_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id   uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role      text NOT NULL DEFAULT 'member' CHECK (role IN ('creator','member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trip_id, user_id)
);

-- ------------------------------------------------------------
-- 4. join_requests
-- ------------------------------------------------------------
CREATE TABLE public.join_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  message    text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trip_id, user_id)
);

CREATE TRIGGER trg_join_requests_updated_at
  BEFORE UPDATE ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 5. flow_alerts
-- ------------------------------------------------------------
CREATE TABLE public.flow_alerts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  river_slug       text NOT NULL,
  gauge_id         text NOT NULL,
  min_cfs          int  NOT NULL,
  max_cfs          int  NOT NULL,
  enabled          bool NOT NULL DEFAULT true,
  last_notified_at timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, river_slug)
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_trips_creator_id      ON public.trips(creator_id);
CREATE INDEX idx_trips_river_slug      ON public.trips(river_slug);
CREATE INDEX idx_trips_date            ON public.trips(date);
CREATE INDEX idx_trips_status          ON public.trips(status);

CREATE INDEX idx_trip_members_trip_id  ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id  ON public.trip_members(user_id);

CREATE INDEX idx_join_requests_trip_id ON public.join_requests(trip_id);
CREATE INDEX idx_join_requests_user_id ON public.join_requests(user_id);
CREATE INDEX idx_join_requests_status  ON public.join_requests(status);

CREATE INDEX idx_flow_alerts_user_id   ON public.flow_alerts(user_id);
CREATE INDEX idx_flow_alerts_river_slug ON public.flow_alerts(river_slug);

-- ------------------------------------------------------------
-- Trigger: handle_new_user — auto-create profile on signup
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _username text;
  _counter  int := 0;
  _candidate text;
BEGIN
  -- derive username from email prefix, strip non-alphanumeric, lowercase
  _username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
  IF _username = '' THEN
    _username := 'paddler';
  END IF;

  -- ensure uniqueness by appending a counter if needed
  _candidate := _username;
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = _candidate);
    _counter  := _counter + 1;
    _candidate := _username || _counter::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name, skill_level)
  VALUES (
    NEW.id,
    _candidate,
    COALESCE(NEW.raw_user_meta_data->>'full_name', _candidate),
    'III'   -- sensible default skill level
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- Trigger: spots_remaining — keep in sync with trip_members
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_spots_remaining()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.trips
    SET
      spots_remaining = GREATEST(spots_remaining - 1, 0),
      status = CASE WHEN spots_remaining - 1 <= 0 THEN 'full' ELSE status END
    WHERE id = NEW.trip_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.trips
    SET
      spots_remaining = spots_remaining + 1,
      status = CASE WHEN status = 'full' AND spots_remaining + 1 > 0 THEN 'open' ELSE status END
    WHERE id = OLD.trip_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_trip_members_spots
  AFTER INSERT OR DELETE ON public.trip_members
  FOR EACH ROW EXECUTE FUNCTION public.sync_spots_remaining();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_alerts  ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- trips
CREATE POLICY "trips_select_public"
  ON public.trips FOR SELECT
  USING (status IN ('open','full','completed'));

CREATE POLICY "trips_insert_authenticated"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "trips_update_creator"
  ON public.trips FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "trips_delete_creator"
  ON public.trips FOR DELETE
  USING (auth.uid() = creator_id);

-- trip_members
CREATE POLICY "trip_members_select_public"
  ON public.trip_members FOR SELECT
  USING (true);

-- INSERT intentionally omitted — service role only

CREATE POLICY "trip_members_delete"
  ON public.trip_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT creator_id FROM public.trips WHERE id = trip_id)
  );

-- join_requests
CREATE POLICY "join_requests_select"
  ON public.join_requests FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT creator_id FROM public.trips WHERE id = trip_id)
  );

CREATE POLICY "join_requests_insert_authenticated"
  ON public.join_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "join_requests_update_creator"
  ON public.join_requests FOR UPDATE
  USING (auth.uid() = (SELECT creator_id FROM public.trips WHERE id = trip_id))
  WITH CHECK (auth.uid() = (SELECT creator_id FROM public.trips WHERE id = trip_id));

-- flow_alerts
CREATE POLICY "flow_alerts_own"
  ON public.flow_alerts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
