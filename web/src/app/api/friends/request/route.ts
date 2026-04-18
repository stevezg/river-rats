import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

// POST /api/friends/request - Send a friend request
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    const { recipientId } = await request.json();

    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient ID is required" },
        { status: 400 }
      );
    }

    // Use the RPC function to send the friend request
    const { data, error } = await supabase.rpc("send_friend_request", {
      other_user_id: recipientId,
    });

    if (error) {
      console.error("Error sending friend request:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send friend request" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, friendshipId: data });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
