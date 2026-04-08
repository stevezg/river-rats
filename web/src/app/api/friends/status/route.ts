import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/friends/status?userId=xxx - Check friendship status with a user
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const otherUserId = searchParams.get("userId");

  if (!otherUserId) {
    return NextResponse.json(
      { error: "userId parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Check for existing friendship in either direction
    const { data: friendships } = await supabase
      .from("friends")
      .select("id, requester_id, recipient_id, status")
      .or(
        `and(requester_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},recipient_id.eq.${user.id})`
      );

    if (!friendships || friendships.length === 0) {
      return NextResponse.json({ status: "none" });
    }

    const friendship = friendships[0];

    if (friendship.status === "accepted") {
      return NextResponse.json({
        status: "accepted",
        friendshipId: friendship.id,
      });
    }

    if (friendship.status === "pending") {
      if (friendship.requester_id === user.id) {
        return NextResponse.json({
          status: "pending_sent",
          friendshipId: friendship.id,
        });
      } else {
        return NextResponse.json({
          status: "pending_received",
          friendshipId: friendship.id,
        });
      }
    }

    if (friendship.status === "declined" || friendship.status === "blocked") {
      return NextResponse.json({
        status: friendship.status,
        friendshipId: friendship.id,
      });
    }

    return NextResponse.json({ status: "none" });
  } catch (error) {
    console.error("Error checking friendship status:", error);
    return NextResponse.json(
      { error: "Failed to check friendship status" },
      { status: 500 }
    );
  }
}
