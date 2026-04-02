-- Add quick_join_enabled to trips (default true — instant join without approval)
ALTER TABLE public.trips ADD COLUMN quick_join_enabled bool NOT NULL DEFAULT true;

-- RPC: instantly join a trip (bypasses join_requests flow)
CREATE OR REPLACE FUNCTION public.instant_join_trip(p_trip_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM trips
    WHERE id = p_trip_id
      AND status = 'open'
      AND spots_remaining > 0
      AND quick_join_enabled = true
  ) THEN
    RAISE EXCEPTION 'Trip is not available for instant join';
  END IF;

  IF EXISTS (
    SELECT 1 FROM trip_members
    WHERE trip_id = p_trip_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Already a member of this trip';
  END IF;

  INSERT INTO trip_members (trip_id, user_id, role)
  VALUES (p_trip_id, auth.uid(), 'member');
END;
$$;
