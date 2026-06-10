"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavbarMessagesLink() {
  const [unread, setUnread] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    async function loadUnread() {
      try {
        const res = await fetch("/api/messages/unread");
        if (res.ok) {
          const data = await res.json();
          setUnread(data.count ?? 0);
        }
      } catch {
        // ignore
      }
    }
    loadUnread();
  }, []);

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
