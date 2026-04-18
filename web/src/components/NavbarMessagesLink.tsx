import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

export default async function NavbarMessagesLink() {
  const session = await auth();

  if (!session.userId) return null;

  const userId = session.userId;
  const supabase = createServiceClient();

  // Get conversation IDs the user is in
  const { data: memberRows } = await supabase
    .from("conversation_members")
    .select("conversation_id, last_read_at")
    .eq("user_id", userId);

  if (!memberRows || memberRows.length === 0) {
    return (
      <Link
        href="/messages"
        className="text-sm font-medium text-[#8B8FA8] transition-colors hover:text-white"
      >
        Messages
      </Link>
    );
  }

  const convIds = memberRows.map((r) => r.conversation_id);

  // Get latest messages for each conversation
  const { data: messages } = await supabase
    .from("messages")
    .select("conversation_id, created_at, sender_id")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: false });

  // Calculate unread count
  let unreadCount = 0;
  for (const row of memberRows) {
    const lastRead = row.last_read_at;
    const convMessages =
      messages?.filter((m) => m.conversation_id === row.conversation_id) || [];
    const unread = lastRead
      ? convMessages.filter(
          (m) => m.created_at > lastRead && m.sender_id !== userId
        ).length
      : convMessages.filter((m) => m.sender_id !== userId).length;
    unreadCount += unread;
  }

  return (
    <Link
      href="/messages"
      className="relative text-sm font-medium text-[#8B8FA8] transition-colors hover:text-white"
    >
      Messages
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
          style={{ backgroundColor: "#4ECDC4", color: "#0F1117" }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
