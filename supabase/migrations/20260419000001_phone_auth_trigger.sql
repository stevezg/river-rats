-- ============================================================
-- Migration: Update handle_new_user trigger for phone auth
-- ============================================================
-- The trigger previously assumed every user had an email address.
-- With phone auth support, we now derive the username from the
-- email prefix (when available) or the phone number.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _username text;
  _counter  int := 0;
  _candidate text;
BEGIN
  -- derive username from email prefix or phone, strip non-alphanumeric, lowercase
  IF NEW.email IS NOT NULL AND NEW.email <> '' THEN
    _username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
  ELSIF NEW.phone IS NOT NULL AND NEW.phone <> '' THEN
    _username := lower(regexp_replace(NEW.phone, '[^a-zA-Z0-9_]', '', 'g'));
  ELSE
    _username := 'paddler';
  END IF;

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
    'III'
  );

  RETURN NEW;
END;
$$;
