"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Message, ConversationDetail } from "@/lib/message-types";

interface Props {
  conversation: ConversationDetail;
  initialMessages: Message[];
  currentUserId: string;
  currentUserName: string;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function groupMessagesByDate(
  messages: Message[]
): Array<{ dateLabel: string; messages: Message[] }> {
  const groups: Array<{ dateLabel: string; messages: Message[] }> = [];
  let currentDate = "";

  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      groups.push({ dateLabel: dateStr, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

export default function MessageThread({
  conversation,
  initialMessages,
  currentUserId,
  currentUserName,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as {
            id: string;
            conversation_id: string;
            sender_id: string;
            body: string;
            created_at: string;
            edited_at: string | null;
          };
          // Don't add own messages (already added optimistically)
          if (newMsg.sender_id === currentUserId) return;

          // Find sender name from members
          const member = conversation.members.find(
            (m) => m.userId === newMsg.sender_id
          );
          const name = member?.displayName ?? "Paddler";

          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              conversationId: newMsg.conversation_id,
              senderId: newMsg.sender_id,
              senderName: name,
              senderInitial: name.charAt(0).toUpperCase(),
              body: newMsg.body,
              createdAt: newMsg.created_at,
              editedAt: newMsg.edited_at,
              isOwn: false,
            },
          ]);

          // Mark as read
          supabase.rpc("mark_conversation_read", {
            p_conversation_id: conversation.id,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id, currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async () => {
    const text = body.trim();
    if (!text || sending) return;

    setSending(true);
    setBody("");

    // Optimistic update
    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic: Message = {
      id: optimisticId,
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderInitial: currentUserName.charAt(0).toUpperCase(),
      body: text,
      createdAt: new Date().toISOString(),
      editedAt: null,
      isOwn: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      body: text,
    });

    if (error) {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setBody(text); // restore
    }

    setSending(false);
    textareaRef.current?.focus();
  }, [body, sending, conversation.id, currentUserId, currentUserName]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const groups = groupMessagesByDate(messages);

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 73px)", backgroundColor: "#0F1117" }}
    >
      {/* Header */}
      <div
        className="flex flex-shrink-0 items-center gap-3 border-b px-4 py-4 sm:px-6"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          backgroundColor: "rgba(15,17,23,0.97)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-white/5"
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B8FA8"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className="truncate text-base font-semibold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {conversation.title}
            </p>
            {conversation.type === "trip" && (
              <span
                className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "rgba(78,205,196,0.12)",
                  color: "#4ECDC4",
                }}
              >
                Crew
              </span>
            )}
          </div>
          <button
            onClick={() => setShowMembers((s) => !s)}
            className="text-xs transition-colors hover:text-white"
            style={{ color: "#5c6070" }}
          >
            {conversation.members.length} member
            {conversation.members.length !== 1 ? "s" : ""}
          </button>
        </div>

        {conversation.type === "trip" && conversation.tripId && (
          <Link
            href={`/trips/${conversation.tripId}`}
            className="flex-shrink-0 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors hover:border-white/20"
            style={{ borderColor: "rgba(78,205,196,0.30)", color: "#4ECDC4" }}
          >
            View Trip
          </Link>
        )}
      </div>

      {/* Members panel */}
      {showMembers && (
        <div
          className="flex-shrink-0 border-b px-4 py-3 sm:px-6"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            backgroundColor: "rgba(28,31,38,0.80)",
          }}
        >
          <div className="flex flex-wrap gap-2">
            {conversation.members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "#8B8FA8",
                }}
              >
                <div
                  className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-[#0F1117]"
                  style={{ backgroundColor: "#4ECDC4" }}
                >
                  {m.displayName.charAt(0).toUpperCase()}
                </div>
                {m.displayName}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {groups.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-base font-medium text-white">No messages yet</p>
            <p className="mt-1 text-sm" style={{ color: "#8B8FA8" }}>
              {conversation.type === "trip"
                ? "Start coordinating with your crew."
                : "Say hello!"}
            </p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.dateLabel}>
            {/* Date divider */}
            <div className="my-6 flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              />
              <span
                className="flex-shrink-0 text-xs"
                style={{ color: "#5c6070" }}
              >
                {group.dateLabel}
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              />
            </div>

            <div className="flex flex-col gap-3">
              {group.messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? group.messages[idx - 1] : null;
                const isConsecutive = prevMsg?.senderId === msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar — only show for first in a run */}
                    <div className="w-8 flex-shrink-0">
                      {!isConsecutive && !msg.isOwn && (
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-[#0F1117]"
                          style={{ backgroundColor: "#4ECDC4" }}
                        >
                          {msg.senderInitial}
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex max-w-[75%] flex-col ${msg.isOwn ? "items-end" : "items-start"}`}
                    >
                      {/* Sender name — only on first in a run, only for others */}
                      {!isConsecutive && !msg.isOwn && (
                        <p
                          className="mb-1 text-xs font-medium"
                          style={{ color: "#8B8FA8" }}
                        >
                          {msg.senderName}
                        </p>
                      )}

                      <div
                        className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                        style={{
                          backgroundColor: msg.isOwn ? "#4ECDC4" : "#1C1F26",
                          color: msg.isOwn ? "#0F1117" : "#FFFFFF",
                          borderBottomRightRadius: msg.isOwn ? "4px" : undefined,
                          borderBottomLeftRadius: !msg.isOwn ? "4px" : undefined,
                          opacity: msg.id.startsWith("optimistic-") ? 0.7 : 1,
                        }}
                      >
                        {msg.body}
                      </div>

                      <p
                        className="mt-1 text-[10px]"
                        style={{ color: "#5c6070" }}
                      >
                        {formatTime(msg.createdAt)}
                        {msg.editedAt && " · edited"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div
        className="flex-shrink-0 border-t px-4 py-3 sm:px-6"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          backgroundColor: "rgba(15,17,23,0.97)",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex items-end gap-3">
          <div
            className="flex-1 rounded-2xl border px-4 py-2.5"
            style={{
              backgroundColor: "#1C1F26",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message your crew…"
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-[#5c6070]"
              style={{ maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!body.trim() || sending}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
            style={{ backgroundColor: "#4ECDC4" }}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M22 2L11 13"
                stroke="#0F1117"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22 11 13 2 9l20-7z"
                stroke="#0F1117"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px]" style={{ color: "#5c6070" }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
