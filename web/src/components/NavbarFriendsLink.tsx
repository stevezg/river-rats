import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";

export default async function NavbarFriendsLink() {
  const user = await getSession();
  if (!user) return null;

  const supabase = createServiceClient();

  // Count pending friend requests
  const { count } = await supabase
    .from("friends")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("status", "pending");

  const pendingCount = count || 0;

  return (
    <Link
      href="/friends"
      className="relative text-sm font-medium text-[#8B8FA8] transition-colors hover:text-white"
    >
      Friends
      {pendingCount > 0 && (
        <span
          className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
          style={{ backgroundColor: "#4ECDC4", color: "#0F1117" }}
        >
          {pendingCount > 9 ? "9+" : pendingCount}
        </span>
      )}
    </Link>
  );
}
