"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function NavbarSignOut() {
  const router = useRouter();

  return (
    <SignOutButton signOutCallback={() => router.push("/")}>
      <button
        className="text-sm font-medium transition-colors hover:text-white"
        style={{ color: "#8B8FA8" }}
      >
        Sign Out
      </button>
    </SignOutButton>
  );
}
