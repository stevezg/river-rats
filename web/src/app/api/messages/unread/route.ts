import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ count: 0 });
  }

  const supabase = createServiceClient();
  const { data: memberRows } = await supabase
    .from("conversation_members")
    .select("conversation_id, last_read_at")
    .eq("user_id", user.id);

  if (!memberRows?.length) {
    return NextResponse.json({ count: 0 });
  }

  const convIds = memberRows.map((r) => r.conversation_id);
  const { data: msgs } = await supabase
    .from("messages")
    .select("id, conversation_id, created_at, sender_id")
    .in("conversation_id", convIds)
    .neq("sender_id", user.id);

  let count = 0;
  for (const row of memberRows) {
    const lastRead = row.last_read_at;
    const unreadMsgs = (msgs ?? []).filter(
      (m) =>
        m.conversation_id === row.conversation_id &&
        (!lastRead || m.created_at > lastRead)
    );
    count += unreadMsgs.length;
  }

  return NextResponse.json({ count });
}
