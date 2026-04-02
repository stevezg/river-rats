"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ConversationSummary } from "@/lib/message-types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Props {
  conversations: ConversationSummary[];
  currentUserId: string;
}

export default function ConversationList({
  conversations: initial,
  currentUserId,
}: Props) {
  const [convos, setConvos] = useState(initial);
  const supabase = createClient();

  // Realtime: bump conversation to top when a new message arrives
  useEffect(() => {
    const channel = supabase
      .channel("messages:inbox")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as {
            conversation_id: string;
            body: string;
            created_at: string;
            sender_id: string;
          };
          setConvos((prev) =>
            prev
              .map((c) =>
                c.id === msg.conversation_id
                  ? {
                      ...c,
                      lastMessage: msg.body,
                      lastMessageAt: msg.created_at,
                      unreadCount:
                        msg.sender_id !== currentUserId
                          ? c.unreadCount + 1
                          : c.unreadCount,
                    }
                  : c
              )
              .sort((a, b) => {
                if (!a.lastMessageAt) return 1;
                if (!b.lastMessageAt) return -1;
                return (
                  new Date(b.lastMessageAt).getTime() -
                  new Date(a.lastMessageAt).getTime()
                );
              })
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (convos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "rgba(78,205,196,0.10)" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-white">No messages yet</p>
        <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
          Join a trip to start chatting with your crew, or post a trip to get
          one going.
        </p>
        <Link
          href="/trips"
          className="mt-6 rounded-full px-6 py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90"
          style={{ backgroundColor: "#4ECDC4" }}
        >
          Browse Trips
        </Link>
      </div>
    );
  }

  const sorted = [...convos].sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return (
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  });

  return (
    <div className="flex flex-col gap-1">
      {sorted.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-4 rounded-2xl border p-4 transition-all hover:border-[rgba(78,205,196,0.20)] hover:bg-white/[0.02]"
          style={{
            backgroundColor:
              conv.unreadCount > 0 ? "rgba(78,205,196,0.04)" : "#1C1F26",
            borderColor:
              conv.unreadCount > 0
                ? "rgba(78,205,196,0.15)"
                : "rgba(255,255,255,0.06)",
          }}
        >
          {/* Avatar */}
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-base font-bold"
            style={{
              backgroundColor:
                conv.type === "trip"
                  ? "rgba(78,205,196,0.15)"
                  : "rgba(82,183,136,0.15)",
              color: conv.type === "trip" ? "#4ECDC4" : "#52B788",
            }}
          >
            {conv.type === "trip" ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            ) : (
              conv.title.charAt(0).toUpperCase()
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p
                className="truncate text-sm font-semibold"
                style={{
                  color: conv.unreadCount > 0 ? "#FFFFFF" : "#D4D6E0",
                }}
              >
                {conv.title}
              </p>
              {conv.lastMessageAt && (
                <span
                  className="flex-shrink-0 text-xs"
                  style={{ color: "#5c6070" }}
                >
                  {timeAgo(conv.lastMessageAt)}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <p className="truncate text-xs" style={{ color: "#5c6070" }}>
                {conv.lastMessage
                  ? `${conv.lastSenderName ? conv.lastSenderName + ": " : ""}${conv.lastMessage}`
                  : conv.type === "trip"
                    ? `Crew chat · ${conv.memberCount} members`
                    : "Start the conversation"}
              </p>
              {conv.unreadCount > 0 && (
                <span
                  className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-[#0F1117]"
                  style={{ backgroundColor: "#4ECDC4" }}
                >
                  {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                </span>
              )}
            </div>
            {conv.type === "trip" && conv.tripSlug && (
              <p
                className="mt-1 text-[10px]"
                style={{ color: "#4ECDC4", opacity: 0.7 }}
              >
                Trip crew chat
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
