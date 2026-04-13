"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function NavbarSignOut() {
  return (
    <SignOutButton>
      <button className="rounded-lg px-3 py-2 text-sm font-medium text-[#8B8FA8] transition-colors hover:bg-white/5 hover:text-white">
        Sign Out
      </button>
    </SignOutButton>
  );
}
