"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  river_slug: string | null;
  trip_id: string | null;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifs(data);

      // Realtime subscription
      const channel = supabase
        .channel("notifications:bell")
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setNotifs((prev) => [payload.new as Notification, ...prev]);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = notifs.filter((n) => !n.read).length;

  async function markAllRead() {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-white/5"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B8FA8" strokeWidth="1.8" aria-hidden="true">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-[#0F1117]"
            style={{ backgroundColor: "#4ECDC4" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border shadow-2xl"
            style={{ backgroundColor: "#1C1F26", borderColor: "rgba(255,255,255,0.10)" }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs transition-colors hover:text-white" style={{ color: "#4ECDC4" }}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifs.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm" style={{ color: "#5c6070" }}>No notifications yet</p>
              ) : (
                notifs.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 border-b px-4 py-3 last:border-0"
                    style={{
                      borderColor: "rgba(255,255,255,0.04)",
                      backgroundColor: n.read ? "transparent" : "rgba(78,205,196,0.04)",
                    }}
                  >
                    <div
                      className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: n.read ? "transparent" : "#4ECDC4" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white leading-snug">{n.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "#8B8FA8" }}>{n.body}</p>
                      {n.river_slug && (
                        <Link
                          href={`/rivers/${n.river_slug}`}
                          className="mt-1 text-xs text-[#4ECDC4] hover:underline"
                          onClick={() => setOpen(false)}
                        >
                          View river →
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
