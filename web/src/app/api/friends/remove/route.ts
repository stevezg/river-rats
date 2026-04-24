import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProfileId } from "@/lib/profile";

// POST /api/friends/remove — unfriend an accepted friend
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
    .delete()
    .eq("id", friendshipId)
    .or(`requester_id.eq.${profileId},recipient_id.eq.${profileId}`)
    .eq("status", "accepted");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
