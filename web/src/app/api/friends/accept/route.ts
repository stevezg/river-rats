import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

// POST /api/friends/accept - Accept a friend request
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    const { friendshipId } = await request.json();

    if (!friendshipId) {
      return NextResponse.json(
        { error: "Friendship ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.rpc("accept_friend_request", {
      friendship_id: friendshipId,
    });

    if (error) {
      console.error("Error accepting friend request:", error);
      return NextResponse.json(
        { error: error.message || "Failed to accept friend request" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return NextResponse.json(
      { error: "Failed to accept friend request" },
      { status: 500 }
    );
  }
}
