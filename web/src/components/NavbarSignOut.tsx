"use client";

import { useRouter } from "next/navigation";

export default function NavbarSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium transition-colors hover:text-white"
      style={{ color: "#8B8FA8" }}
    >
      Sign Out
    </button>
  );
}
