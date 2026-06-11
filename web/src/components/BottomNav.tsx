"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MessageCircle, Plus, UserRound, Waves } from "lucide-react";

const tabs = [
  { href: "/rivers", label: "Rivers", icon: Waves },
  { href: "/trips", label: "Trips", icon: CalendarDays },
  { href: "/trips/new", label: "Create", icon: Plus, primary: true },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t"
      style={{
        backgroundColor: "rgba(15, 17, 23, 0.97)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.06)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Main navigation"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors"
            style={{ color: isActive ? "#4ECDC4" : "#5c6070" }}
            aria-current={isActive ? "page" : undefined}
            aria-label={tab.label}
          >
            <span
              className={
                tab.primary
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#4ECDC4] text-[#0F1117]"
                  : "flex h-6 w-6 items-center justify-center"
              }
            >
              <Icon className={tab.primary ? "h-5 w-5" : "h-5 w-5"} strokeWidth={isActive || tab.primary ? 2.4 : 1.9} aria-hidden="true" />
            </span>
            <span className="max-w-full truncate text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
