-- ============================================================
-- Clerk Auth Migration
-- Replaces Supabase Auth with Clerk for identity management.
-- profiles.id remains a UUID primary key; clerk_user_id links to Clerk.
-- All server-side operations use the service role key (bypasses RLS).
-- ============================================================

-- 1. Remove the FK constraint linking profiles.id to auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Add clerk_user_id for Clerk identity lookups
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS clerk_user_id text UNIQUE;

-- 3. Index for fast lookups by Clerk user ID
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id
  ON public.profiles (clerk_user_id);

-- 4. Drop the Supabase Auth signup trigger — Clerk handles identity creation.
--    Profiles are now created on first login via the /api/auth/sync API route.
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 5. Update profile RLS: service role is used for all writes (bypasses RLS).
--    Drop the old insert policy that checked auth.uid() = id (no longer valid).
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Public can still read all profiles (display names, skill levels for trip cards).
-- Writes happen via API routes using service role — no client-direct mutations.

-- 6. Update other RLS policies that reference auth.uid() for writes.
--    Reads remain open; all mutations go through service-role API routes.

-- trips: keep public select, drop direct insert/update/delete (API routes handle these)
DROP POLICY IF EXISTS "trips_insert_authenticated" ON public.trips;
DROP POLICY IF EXISTS "trips_update_creator" ON public.trips;
DROP POLICY IF EXISTS "trips_delete_creator" ON public.trips;

-- join_requests: keep visibility select, drop direct mutations
DROP POLICY IF EXISTS "join_requests_insert_authenticated" ON public.join_requests;
DROP POLICY IF EXISTS "join_requests_update_creator" ON public.join_requests;
DROP POLICY IF EXISTS "join_requests_select" ON public.join_requests;

-- Re-add open select for join_requests (service role reads in API routes)
CREATE POLICY "join_requests_select_public"
  ON public.join_requests FOR SELECT
  USING (true);

-- flow_alerts: service role manages these
DROP POLICY IF EXISTS "flow_alerts_own" ON public.flow_alerts;
CREATE POLICY "flow_alerts_select_own"
  ON public.flow_alerts FOR SELECT
  USING (true);

-- friends: keep visibility, API routes handle mutations
DROP POLICY IF EXISTS "friends_insert_own" ON public.friends;
DROP POLICY IF EXISTS "friends_update_own" ON public.friends;
DROP POLICY IF EXISTS "friends_delete_own" ON public.friends;

-- conversations / messages: service role for writes, members select via API
DROP POLICY IF EXISTS "conversations_member_select" ON public.conversations;
DROP POLICY IF EXISTS "conv_members_select" ON public.conversation_members;
DROP POLICY IF EXISTS "conv_members_update_own" ON public.conversation_members;
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;

-- Open reads for now — all filtered in API routes by membership check
CREATE POLICY "conversations_select_all" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "conv_members_select_all" ON public.conversation_members FOR SELECT USING (true);
CREATE POLICY "messages_select_all" ON public.messages FOR SELECT USING (true);
