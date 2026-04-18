import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";
import MessageThread from "./MessageThread";
import type { Metadata } from "next";

interface MessagesPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MessagesPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Conversation | River Rats`,
  };
}

export default async function ConversationPage({ params }: MessagesPageProps) {
  const session = await auth();
  
  if (!session.userId) {
    redirect("/login?next=/messages");
  }

  const userId = session.userId;
  const { id } = await params;
  const supabase = createServiceClient();

  // Check if user is a member of this conversation
  const { data: membership } = await supabase
    .from("conversation_members")
    .select("id")
    .eq("conversation_id", id)
    .eq("user_id", userId)
    .single();

  if (!membership) {
    notFound();
  }

  // Get conversation details
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, type, title, trip_id, trips(river_slug)")
    .eq("id", id)
    .single();

  if (!conversation) {
    notFound();
  }

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at, edited_at, profiles!sender_id(display_name)")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // Get other members for DM title
  let title = conversation.title ?? "Conversation";
  if (conversation.type === "direct") {
    const { data: otherMember } = await supabase
      .from("conversation_members")
      .select("profiles(display_name)")
      .eq("conversation_id", id)
      .neq("user_id", userId)
      .single();
    
    if (otherMember?.profiles) {
      const prof = Array.isArray(otherMember.profiles) 
        ? otherMember.profiles[0] 
        : otherMember.profiles;
      title = (prof as { display_name?: string })?.display_name ?? "Paddler";
    }
  }

  // Mark conversation as read
  await supabase.rpc("mark_conversation_read", {
    p_conversation_id: id,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 border-b px-4 py-4"
        style={{
          backgroundColor: "rgba(15, 17, 23, 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <a
            href="/messages"
            className="text-sm text-[#8B8FA8] hover:text-white transition-colors"
          >
            ← Back
          </a>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <div className="w-12" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Message Thread */}
      <div className="mx-auto max-w-2xl px-4 py-6 pb-32">
        <MessageThread
          messages={messages?.map((m) => ({
            id: m.id,
            conversationId: id,
            senderId: m.sender_id,
            senderName: (Array.isArray(m.profiles) ? m.profiles[0]?.display_name : (m.profiles as { display_name?: string })?.display_name) ?? "Unknown",
            senderInitial: ((Array.isArray(m.profiles) ? m.profiles[0]?.display_name : (m.profiles as { display_name?: string })?.display_name) ?? "U")[0].toUpperCase(),
            body: m.body,
            createdAt: m.created_at,
            editedAt: m.edited_at,
            isOwn: m.sender_id === userId,
          })) ?? []}
          conversationId={id}
          currentUserId={userId}
        />
      </div>
    </div>
  );
}
