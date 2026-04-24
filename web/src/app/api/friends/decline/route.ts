import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProfileId } from "@/lib/profile";

// POST /api/friends/decline — decline an incoming friend request
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileId = await getProfileId(userId);
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { friendshipId } = await request.json();
  if (!friendshipId) {
    return NextResponse.json({ error: "friendshipId is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("friends")
    .update({ status: "declined" })
    .eq("id", friendshipId)
    .eq("recipient_id", profileId)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
