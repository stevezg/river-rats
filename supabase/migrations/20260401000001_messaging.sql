-- ============================================================
-- Messaging system: conversations, members, messages
-- ============================================================

-- conversations: wraps both trip group chats and 1:1 DMs
CREATE TABLE public.conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text NOT NULL CHECK (type IN ('trip', 'direct')),
  trip_id    uuid REFERENCES public.trips(id) ON DELETE CASCADE,
  title      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conversations_trip_id_unique UNIQUE (trip_id)
);

-- who is in each conversation
CREATE TABLE public.conversation_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at       timestamptz NOT NULL DEFAULT now(),
  last_read_at    timestamptz,
  UNIQUE (conversation_id, user_id)
);

-- the actual messages
CREATE TABLE public.messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body            text NOT NULL CHECK (length(trim(body)) > 0 AND length(body) <= 2000),
  created_at      timestamptz NOT NULL DEFAULT now(),
  edited_at       timestamptz
);

-- indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id, created_at);
CREATE INDEX idx_conv_members_user_id     ON public.conversation_members(user_id);
CREATE INDEX idx_conv_members_conv_id     ON public.conversation_members(conversation_id);
CREATE INDEX idx_conversations_trip_id   ON public.conversations(trip_id);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.conversations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages              ENABLE ROW LEVEL SECURITY;

-- conversations: visible only to members
CREATE POLICY "conversations_member_select"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = conversations.id AND user_id = auth.uid()
    )
  );

-- conversation_members: visible to members of that conversation
CREATE POLICY "conv_members_select"
  ON public.conversation_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
        AND cm.user_id = auth.uid()
    )
  );

-- members can update their own last_read_at
CREATE POLICY "conv_members_update_own"
  ON public.conversation_members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- messages: readable by conversation members
CREATE POLICY "messages_select"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

-- messages: sendable by conversation members
CREATE POLICY "messages_insert"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- Auto-create trip conversations + add members
-- ============================================================

-- When a trip is created → auto-create its group chat + add creator
CREATE OR REPLACE FUNCTION public.create_trip_conversation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _conv_id uuid;
BEGIN
  INSERT INTO public.conversations (type, trip_id, title)
  VALUES ('trip', NEW.id, NEW.river_name)
  RETURNING id INTO _conv_id;

  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES (_conv_id, NEW.creator_id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_trip_create_conversation
  AFTER INSERT ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.create_trip_conversation();

-- When someone joins a trip → add them to the trip's conversation
CREATE OR REPLACE FUNCTION public.add_member_to_trip_conversation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _conv_id uuid;
BEGIN
  SELECT id INTO _conv_id
  FROM public.conversations
  WHERE trip_id = NEW.trip_id AND type = 'trip';

  IF _conv_id IS NOT NULL THEN
    INSERT INTO public.conversation_members (conversation_id, user_id)
    VALUES (_conv_id, NEW.user_id)
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_trip_member_join_conversation
  AFTER INSERT ON public.trip_members
  FOR EACH ROW EXECUTE FUNCTION public.add_member_to_trip_conversation();

-- ============================================================
-- RPC: create or get a direct message conversation
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_or_get_dm(other_user_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _conv_id uuid;
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _me = other_user_id THEN RAISE EXCEPTION 'Cannot DM yourself'; END IF;

  -- Find existing DM between these two users
  SELECT cm1.conversation_id INTO _conv_id
  FROM public.conversation_members cm1
  JOIN public.conversation_members cm2
    ON cm1.conversation_id = cm2.conversation_id
  JOIN public.conversations c
    ON c.id = cm1.conversation_id
  WHERE c.type = 'direct'
    AND cm1.user_id = _me
    AND cm2.user_id = other_user_id;

  IF _conv_id IS NOT NULL THEN
    RETURN _conv_id;
  END IF;

  -- Create new DM conversation
  INSERT INTO public.conversations (type)
  VALUES ('direct')
  RETURNING id INTO _conv_id;

  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES (_conv_id, _me), (_conv_id, other_user_id);

  RETURN _conv_id;
END;
$$;

-- ============================================================
-- RPC: mark conversation as read
-- ============================================================
CREATE OR REPLACE FUNCTION public.mark_conversation_read(p_conversation_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.conversation_members
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id AND user_id = auth.uid();
END;
$$;

-- ============================================================
-- Realtime
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;
