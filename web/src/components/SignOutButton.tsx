"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-xl border px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/5 active:scale-[0.98]"
      style={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      Sign Out
    </button>
  );
}
