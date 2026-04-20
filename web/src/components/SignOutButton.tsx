"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <ClerkSignOutButton>
      <button
        className={
          className ||
          "rounded-lg px-4 py-2 text-sm font-medium text-[#8B8FA8] transition-colors hover:bg-white/5 hover:text-white"
        }
      >
        Sign Out
      </button>
    </ClerkSignOutButton>
  );
}
