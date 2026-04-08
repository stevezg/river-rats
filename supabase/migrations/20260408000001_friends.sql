-- ============================================================
-- Friends system: friend requests and friendships
-- ============================================================

-- friends table: tracks friend relationships
-- status: 'pending', 'accepted', 'declined', 'blocked'
CREATE TABLE public.friends (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requester_id, recipient_id)
);

-- indexes
CREATE INDEX idx_friends_requester_id ON public.friends(requester_id, status);
CREATE INDEX idx_friends_recipient_id ON public.friends(recipient_id, status);
CREATE INDEX idx_friends_status ON public.friends(status);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Users can see their own friendships (either as requester or recipient)
CREATE POLICY "friends_select_own"
  ON public.friends FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Users can create friend requests
CREATE POLICY "friends_insert_own"
  ON public.friends FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Users can update their own requests (cancel) or incoming requests (accept/decline)
CREATE POLICY "friends_update_own"
  ON public.friends FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Users can delete their own friendships
CREATE POLICY "friends_delete_own"
  ON public.friends FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- ============================================================
-- Functions
-- ============================================================

-- Send a friend request
CREATE OR REPLACE FUNCTION public.send_friend_request(other_user_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _existing_id uuid;
  _new_id uuid;
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _me = other_user_id THEN RAISE EXCEPTION 'Cannot friend yourself'; END IF;

  -- Check if friendship already exists in either direction
  SELECT id INTO _existing_id
  FROM public.friends
  WHERE (requester_id = _me AND recipient_id = other_user_id)
     OR (requester_id = other_user_id AND recipient_id = _me);

  IF _existing_id IS NOT NULL THEN
    RAISE EXCEPTION 'Friendship already exists';
  END IF;

  -- Create the friend request
  INSERT INTO public.friends (requester_id, recipient_id, status)
  VALUES (_me, other_user_id, 'pending')
  RETURNING id INTO _new_id;

  RETURN _new_id;
END;
$$;

-- Accept a friend request
CREATE OR REPLACE FUNCTION public.accept_friend_request(friendship_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  UPDATE public.friends
  SET status = 'accepted', updated_at = now()
  WHERE id = friendship_id
    AND recipient_id = _me
    AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Friend request not found or not authorized';
  END IF;
END;
$$;

-- Decline a friend request
CREATE OR REPLACE FUNCTION public.decline_friend_request(friendship_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  UPDATE public.friends
  SET status = 'declined', updated_at = now()
  WHERE id = friendship_id
    AND recipient_id = _me
    AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Friend request not found or not authorized';
  END IF;
END;
$$;

-- Remove a friendship (unfriend)
CREATE OR REPLACE FUNCTION public.remove_friend(friend_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  DELETE FROM public.friends
  WHERE ((requester_id = _me AND recipient_id = friend_user_id)
      OR (requester_id = friend_user_id AND recipient_id = _me))
    AND status = 'accepted';
END;
$$;

-- Cancel a pending request I sent
CREATE OR REPLACE FUNCTION public.cancel_friend_request(friendship_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  DELETE FROM public.friends
  WHERE id = friendship_id
    AND requester_id = _me
    AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Friend request not found or not authorized';
  END IF;
END;
$$;

-- ============================================================
-- Views for easy querying
-- ============================================================

-- View: My friends (accepted friendships with profile info)
CREATE OR REPLACE VIEW public.my_friends AS
SELECT 
  f.id as friendship_id,
  f.requester_id,
  f.recipient_id,
  f.created_at as friends_since,
  CASE 
    WHEN f.requester_id = auth.uid() THEN f.recipient_id
    ELSE f.requester_id
  END as friend_id,
  p.display_name as friend_name,
  p.bio as friend_bio
FROM public.friends f
JOIN public.profiles p ON p.id = CASE 
  WHEN f.requester_id = auth.uid() THEN f.recipient_id
  ELSE f.requester_id
END
WHERE (f.requester_id = auth.uid() OR f.recipient_id = auth.uid())
  AND f.status = 'accepted';

-- View: Pending friend requests sent by me
CREATE OR REPLACE VIEW public.pending_requests_sent AS
SELECT 
  f.id as friendship_id,
  f.recipient_id,
  f.created_at,
  p.display_name as recipient_name
FROM public.friends f
JOIN public.profiles p ON p.id = f.recipient_id
WHERE f.requester_id = auth.uid()
  AND f.status = 'pending';

-- View: Pending friend requests received by me
CREATE OR REPLACE VIEW public.pending_requests_received AS
SELECT 
  f.id as friendship_id,
  f.requester_id,
  f.created_at,
  p.display_name as requester_name
FROM public.friends f
JOIN public.profiles p ON p.id = f.requester_id
WHERE f.recipient_id = auth.uid()
  AND f.status = 'pending';
