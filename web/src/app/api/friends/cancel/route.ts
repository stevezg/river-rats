import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/friends/cancel - Cancel a sent friend request
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { friendshipId } = await request.json();

    if (!friendshipId) {
      return NextResponse.json(
        { error: "Friendship ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.rpc("cancel_friend_request", {
      friendship_id: friendshipId,
    });

    if (error) {
      console.error("Error canceling friend request:", error);
      return NextResponse.json(
        { error: error.message || "Failed to cancel friend request" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    return NextResponse.json(
      { error: "Failed to cancel friend request" },
      { status: 500 }
    );
  }
}
