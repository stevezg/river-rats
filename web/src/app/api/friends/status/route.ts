import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

// GET /api/friends/status?userId=xxx - Check friendship status with a user
export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;
  const supabase = createServiceClient();

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
        `and(requester_id.eq.${userId},recipient_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},recipient_id.eq.${userId})`
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
      if (friendship.requester_id === userId) {
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
