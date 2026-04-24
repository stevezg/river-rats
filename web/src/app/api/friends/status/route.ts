import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProfileId } from "@/lib/profile";

// GET /api/friends/status?userId=<profile-uuid> — friendship status with another user
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileId = await getProfileId(userId);
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const otherProfileId = request.nextUrl.searchParams.get("userId");
  if (!otherProfileId) {
    return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: friendships } = await supabase
    .from("friends")
    .select("id, requester_id, recipient_id, status")
    .or(
      `and(requester_id.eq.${profileId},recipient_id.eq.${otherProfileId}),` +
      `and(requester_id.eq.${otherProfileId},recipient_id.eq.${profileId})`
    );

  if (!friendships || friendships.length === 0) {
    return NextResponse.json({ status: "none" });
  }

  const f = friendships[0];

  if (f.status === "accepted") {
    return NextResponse.json({ status: "accepted", friendshipId: f.id });
  }

  if (f.status === "pending") {
    return NextResponse.json({
      status: f.requester_id === profileId ? "pending_sent" : "pending_received",
      friendshipId: f.id,
    });
  }

  return NextResponse.json({ status: f.status, friendshipId: f.id });
}
