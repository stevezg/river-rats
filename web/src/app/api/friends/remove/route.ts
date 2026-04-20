import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

// POST /api/friends/remove - Remove a friend
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;
  const supabase = createServiceClient();

  try {
    const { friendshipId } = await request.json();

    if (!friendshipId) {
      return NextResponse.json(
        { error: "Friendship ID is required" },
        { status: 400 }
      );
    }

    // Get the friendship to find the other user
    const { data: friendship } = await supabase
      .from("friends")
      .select("requester_id, recipient_id")
      .eq("id", friendshipId)
      .single();

    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      );
    }

    const otherUserId =
      friendship.requester_id === userId
        ? friendship.recipient_id
        : friendship.requester_id;

    const { error } = await supabase.rpc("remove_friend", {
      friend_user_id: otherUserId,
    });

    if (error) {
      console.error("Error removing friend:", error);
      return NextResponse.json(
        { error: error.message || "Failed to remove friend" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json(
      { error: "Failed to remove friend" },
      { status: 500 }
    );
  }
}
