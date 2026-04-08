import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessageThread from "./MessageThread";
import type { Message, ConversationDetail } from "@/lib/message-types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("title, type")
    .eq("id", id)
    .single();
  return { title: `${data?.title ?? "Chat"} | River Rats` };
}

export default async function MessageThreadPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/messages/${id}`);

  // Load conversation + membership check in parallel
  const [{ data: conv }, { data: memberRow }] = await Promise.all([
    supabase
      .from("conversations")
      .select(
        `
        id, type, title, trip_id,
        trips ( river_slug ),
        conversation_members (
          user_id,
          profiles ( display_name )
        )
      `
      )
      .eq("id", id)
      .single(),
    supabase
      .from("conversation_members")
      .select("id")
      .eq("conversation_id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (!conv || !memberRow) notFound();

  // Load last 50 messages
  const { data: rawMessages } = await supabase
    .from("messages")
    .select(
      "id, conversation_id, sender_id, body, created_at, edited_at, profiles!sender_id(display_name)"
    )
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(50);

  // Mark conversation as read
  await supabase.rpc("mark_conversation_read", { p_conversation_id: id });

  const messages: Message[] = (rawMessages ?? []).map((m) => {
    const prof = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    const name =
      (prof as { display_name?: string } | null)?.display_name ?? "Paddler";
    return {
      id: m.id,
      conversationId: m.conversation_id,
      senderId: m.sender_id,
      senderName: name,
      senderInitial: name.charAt(0).toUpperCase(),
      body: m.body,
      createdAt: m.created_at,
      editedAt: m.edited_at ?? null,
      isOwn: m.sender_id === user.id,
    };
  });

  type MemberRow = { user_id: string; profiles: unknown };
  const members = (
    (conv.conversation_members ?? []) as MemberRow[]
  ).map((m) => {
    const prof = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    return {
      userId: m.user_id,
      displayName:
        (prof as { display_name?: string } | null)?.display_name ?? "Paddler",
      joinedAt: "",
    };
  });

  const tripData = conv.trips as { river_slug?: string } | null;
  const convDetail: ConversationDetail = {
    id: conv.id,
    type: conv.type as "trip" | "direct",
    title: conv.title ?? "Chat",
    tripId: conv.trip_id ?? null,
    tripSlug: tripData?.river_slug ?? null,
    members,
  };

  // Get current user's display name
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();
  const myName = myProfile?.display_name ?? "You";

  return (
    <MessageThread
      conversation={convDetail}
      initialMessages={messages}
      currentUserId={user.id}
      currentUserName={myName}
    />
  );
}
