"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NavbarSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
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
