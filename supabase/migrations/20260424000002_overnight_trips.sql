-- ============================================================
-- Overnight & Multi-day Trips
-- Adds trip_type and end_date to support day, overnight,
-- and multi-day expedition trips.
-- ============================================================

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS trip_type text NOT NULL DEFAULT 'day'
    CHECK (trip_type IN ('day', 'overnight', 'expedition')),
  ADD COLUMN IF NOT EXISTS end_date date;

-- end_date required for overnight/expedition; must be on or after start date
ALTER TABLE public.trips
  ADD CONSTRAINT trips_end_date_check CHECK (
    (trip_type = 'day' AND end_date IS NULL)
    OR (trip_type IN ('overnight', 'expedition') AND end_date IS NOT NULL AND end_date >= date)
  );

CREATE INDEX IF NOT EXISTS idx_trips_trip_type ON public.trips (trip_type);
