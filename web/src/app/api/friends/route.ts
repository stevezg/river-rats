import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

// GET /api/friends - Get all friends and pending requests
export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;
  const supabase = createServiceClient();

  try {
    // Get accepted friends using the view
    const { data: friends } = await supabase
      .from("my_friends")
      .select("friendship_id, friend_id, friend_name, friend_bio, friends_since")
      .order("friends_since", { ascending: false });

    // Get pending requests received
    const { data: pendingReceived } = await supabase
      .from("pending_requests_received")
      .select("friendship_id, requester_id, requester_name, created_at")
      .order("created_at", { ascending: false });

    // Get pending requests sent
    const { data: pendingSent } = await supabase
      .from("pending_requests_sent")
      .select("friendship_id, recipient_id, recipient_name, created_at")
      .order("created_at", { ascending: false });

    return NextResponse.json({
      friends: friends?.map((f) => ({
        friendshipId: f.friendship_id,
        friendId: f.friend_id,
        friendName: f.friend_name,
        friendBio: f.friend_bio,
        friendsSince: f.friends_since,
      })) || [],
      pendingReceived: pendingReceived?.map((r) => ({
        friendshipId: r.friendship_id,
        requesterId: r.requester_id,
        requesterName: r.requester_name,
        createdAt: r.created_at,
      })) || [],
      pendingSent: pendingSent?.map((s) => ({
        friendshipId: s.friendship_id,
        recipientId: s.recipient_id,
        recipientName: s.recipient_name,
        createdAt: s.created_at,
      })) || [],
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
