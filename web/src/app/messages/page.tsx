import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";
import ConversationList from "@/components/ConversationList";
import type { ConversationSummary } from "@/lib/message-types";

export const metadata: Metadata = {
  title: "Messages | River Rats",
  description: "Your conversations with paddling crew.",
};

export default async function MessagesPage() {
  const session = await auth();
  
  if (!session.userId) {
    redirect("/login?next=/messages");
  }

  const userId = session.userId;
  const supabase = createServiceClient();

  // Fetch all conversations the user is in, with nested members + profiles
  const { data: memberRows } = await supabase
    .from("conversation_members")
    .select(
      `
      conversation_id,
      last_read_at,
      conversations (
        id, type, title, trip_id,
        trips ( river_slug ),
        conversation_members ( user_id, profiles ( display_name ) )
      )
    `
    )
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  // Collect all conversation IDs
  const convIds = (memberRows ?? []).map((r) => r.conversation_id);

  // For each conversation, get the last message (and sender name)
  type LastMessage = {
    id: string;
    conversation_id: string;
    body: string;
    created_at: string;
    sender_id: string;
    profiles: { display_name: string }[] | { display_name: string } | null;
  };

  const { data: lastMessagesRaw } =
    convIds.length > 0
      ? await supabase
          .from("messages")
          .select(
            "id, conversation_id, body, created_at, sender_id, profiles!sender_id(display_name)"
          )
          .in("conversation_id", convIds)
          .order("created_at", { ascending: false })
      : { data: [] as LastMessage[] };

  const lastMessages = (lastMessagesRaw ?? []) as LastMessage[];

  // Build map: conversation_id → latest message
  const latestMsgMap = new Map<string, LastMessage>();
  for (const msg of lastMessages ?? []) {
    if (!latestMsgMap.has(msg.conversation_id)) {
      latestMsgMap.set(msg.conversation_id, msg);
    }
  }

  // Compute per-conversation unread counts from last_read_at
  const unreadMap = new Map<string, number>();
  for (const row of memberRows ?? []) {
    const lastRead = row.last_read_at;
    const msgs = lastMessages.filter(
      (m) => m.conversation_id === row.conversation_id
    );
    const unread = lastRead
      ? msgs.filter(
          (m) => m.created_at > lastRead && m.sender_id !== userId
        ).length
      : msgs.filter((m) => m.sender_id !== userId).length;
    unreadMap.set(row.conversation_id, unread);
  }

  // Shape into ConversationSummary[]
  const conversations: ConversationSummary[] = (memberRows ?? [])
    .map((row) => {
      const conv = Array.isArray(row.conversations)
        ? row.conversations[0]
        : row.conversations;
      if (!conv) return null;

      type MemberRow = { user_id: string; profiles: unknown };
      const allMembers = (conv.conversation_members ?? []) as MemberRow[];
      const otherMembers = allMembers.filter((m) => m.user_id !== userId);

      // Title: other user's name for DM; river name for trip chat
      let title = conv.title ?? "Conversation";
      let otherUserId: string | undefined;
      if (conv.type === "direct" && otherMembers.length > 0) {
        const other = otherMembers[0];
        const prof = Array.isArray(other.profiles)
          ? other.profiles[0]
          : other.profiles;
        title =
          (prof as { display_name?: string } | null)?.display_name ??
          "Paddler";
        otherUserId = other.user_id;
      }

      const lastMsg = latestMsgMap.get(row.conversation_id);
      const lastSenderProf = lastMsg
        ? Array.isArray(lastMsg.profiles)
          ? lastMsg.profiles[0]
          : lastMsg.profiles
        : null;

      const summary: ConversationSummary = {
        id: row.conversation_id,
        type: conv.type as "trip" | "direct",
        title,
        tripId: conv.trip_id ?? null,
        tripSlug:
          (conv.trips as { river_slug?: string } | null)?.river_slug ?? null,
        lastMessage: lastMsg?.body ?? null,
        lastMessageAt: lastMsg?.created_at ?? null,
        lastSenderName:
          (lastSenderProf as { display_name?: string } | null)?.display_name ??
          null,
        unreadCount: unreadMap.get(row.conversation_id) ?? 0,
        memberCount: allMembers.length,
        ...(otherUserId !== undefined ? { otherUserId } : {}),
      };
      return summary;
    })
    .filter((c): c is ConversationSummary => c !== null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      <div
        className="border-b px-4 py-10 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(78,205,196,0.08) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Messages
          </h1>
          <p className="mt-2 text-base" style={{ color: "#8B8FA8" }}>
            Crew chats and direct messages
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-10">
        <ConversationList
          conversations={conversations}
          currentUserId={userId}
        />
      </div>
    </div>
  );
}
