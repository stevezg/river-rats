"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <ClerkSignOutButton signOutCallback={() => router.push("/")}>
      <button
        className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/5 active:scale-[0.98]"
        style={{ borderColor: "rgba(255,255,255,0.12)" }}
      >
        Sign Out
      </button>
    </ClerkSignOutButton>
  );
}
