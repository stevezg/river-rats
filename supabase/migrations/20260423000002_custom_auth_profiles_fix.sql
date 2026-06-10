-- ============================================================-- River Rats — Custom Auth Profiles Fix-- Makes the existing profiles table work with custom auth users-- ============================================================

-- 1. Drop the FK to auth.users so our custom users UUIDs can live in profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Sync any existing custom-auth users into profiles
INSERT INTO public.profiles (
  id, username, display_name, skill_level, home_river_slug, bio, avatar_url
)
SELECT
  id, username, display_name, skill_level, home_river_slug, bio, avatar_url
FROM public.users
ON CONFLICT (id) DO UPDATE SET
  username       = EXCLUDED.username,
  display_name   = EXCLUDED.display_name,
  skill_level    = EXCLUDED.skill_level,
  home_river_slug = EXCLUDED.home_river_slug,
  bio            = EXCLUDED.bio,
  avatar_url     = EXCLUDED.avatar_url;

-- 3. Keep profiles and users in sync via trigger
CREATE OR REPLACE FUNCTION public.sync_user_to_profile()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, skill_level, home_river_slug, bio, avatar_url)
  VALUES (NEW.id, NEW.username, NEW.display_name, NEW.skill_level, NEW.home_river_slug, NEW.bio, NEW.avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    display_name    = EXCLUDED.display_name,
    skill_level     = EXCLUDED.skill_level,
    home_river_slug = EXCLUDED.home_river_slug,
    bio             = EXCLUDED.bio,
    avatar_url      = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_to_profile ON public.users;
CREATE TRIGGER trg_sync_user_to_profile
  AFTER INSERT OR UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_to_profile();

-- 4. Also sync deletes
CREATE OR REPLACE FUNCTION public.sync_user_delete_to_profile()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_delete_to_profile ON public.users;
CREATE TRIGGER trg_sync_user_delete_to_profile
  AFTER DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_delete_to_profile();
