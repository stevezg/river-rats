-- ============================================================
-- River Rats — Custom Auth (SUR-XX)
-- Replaces Supabase Auth with simple email/password
-- ============================================================

-- ------------------------------------------------------------
-- 1. users table
-- ------------------------------------------------------------
CREATE TABLE public.users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name  text NOT NULL,
  username      text UNIQUE NOT NULL,
  skill_level   text NOT NULL CHECK (skill_level IN ('I-II','III','III-IV','IV','IV-V','V','V+')),
  home_river_slug text,
  bio           text,
  avatar_url    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 2. sessions table
-- ------------------------------------------------------------
CREATE TABLE public.sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_expires ON public.sessions(expires_at);

-- ------------------------------------------------------------
-- 3. Row Level Security
-- ------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- users: public read for profiles, self update
CREATE POLICY "users_select_public"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (id = current_setting('app.current_user_id', true)::uuid);

-- sessions: only accessible via service role (API routes)
CREATE POLICY "sessions_service_only"
  ON public.sessions FOR ALL
  USING (false)
  WITH CHECK (false);

-- ------------------------------------------------------------
-- 4. Migrate existing profiles (optional, manual step)
--    If you have existing Supabase auth users, run:
--    INSERT INTO public.users (id, email, password_hash, display_name, username, skill_level, ...)
--    SELECT id, email, 'MIGRATED_FROM_SUPABASE_AUTH', display_name, username, skill_level, ...
--    FROM public.profiles;
-- ------------------------------------------------------------
