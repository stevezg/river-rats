import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProfileId } from "@/lib/profile";

// POST /api/friends/request — send a friend request
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileId = await getProfileId(userId);
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { recipientId } = await request.json();
  if (!recipientId) {
    return NextResponse.json({ error: "recipientId is required" }, { status: 400 });
  }
  if (recipientId === profileId) {
    return NextResponse.json({ error: "Cannot friend yourself" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("friends")
    .select("id")
    .or(
      `and(requester_id.eq.${profileId},recipient_id.eq.${recipientId}),` +
      `and(requester_id.eq.${recipientId},recipient_id.eq.${profileId})`
    )
    .single();

  if (existing) {
    return NextResponse.json({ error: "Friendship already exists" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("friends")
    .insert({ requester_id: profileId, recipient_id: recipientId, status: "pending" })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, friendshipId: data.id });
}
