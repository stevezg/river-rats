"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

export default function NavbarMessagesLink() {
  const [unread, setUnread] = useState(0);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let channelCleanup: (() => void) | undefined;

    async function loadUnread() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberRows } = await supabase
        .from("conversation_members")
        .select("conversation_id, last_read_at")
        .eq("user_id", user.id);

      if (!memberRows?.length) return;

      const convIds = memberRows.map((r) => r.conversation_id);
      const { data: msgs } = await supabase
        .from("messages")
        .select("id, conversation_id, created_at, sender_id")
        .in("conversation_id", convIds)
        .neq("sender_id", user.id);

      let count = 0;
      for (const row of memberRows) {
        const lastRead = row.last_read_at;
        const unreadMsgs = (msgs ?? []).filter(
          (m) =>
            m.conversation_id === row.conversation_id &&
            (!lastRead || m.created_at > lastRead)
        );
        count += unreadMsgs.length;
      }
      setUnread(count);

      // Realtime: listen for new messages in user's conversations
      const channel = supabase
        .channel("messages:navbar-unread")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const msg = payload.new as {
              sender_id: string;
              conversation_id: string;
            };
            if (
              msg.sender_id !== user.id &&
              convIds.includes(msg.conversation_id)
            ) {
              setUnread((n) => n + 1);
            }
          }
        )
        .subscribe();

      channelCleanup = () => {
        supabase.removeChannel(channel);
      };
    }

    loadUnread();

    return () => {
      channelCleanup?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset count when navigating to messages
  useEffect(() => {
    if (pathname.startsWith("/messages")) setUnread(0);
  }, [pathname]);

  const isActive = pathname.startsWith("/messages");

  return (
    <Link
      href="/messages"
      className="relative text-sm font-medium transition-colors hover:text-white"
      style={{ color: isActive ? "#4ECDC4" : "#8B8FA8" }}
    >
      Messages
      {unread > 0 && (
        <span
          className="absolute -right-3 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-[#0F1117]"
          style={{ backgroundColor: "#4ECDC4" }}
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
