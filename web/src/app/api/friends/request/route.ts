import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

// POST /api/friends/request - Send a friend request
export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
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

    if (user.id === recipientId) {
      return NextResponse.json(
        { error: "Cannot friend yourself" },
        { status: 400 }
      );
    }

    // Check if friendship already exists in either direction
    const { data: existing } = await supabase
      .from("friends")
      .select("id")
      .or(
        `and(requester_id.eq.${user.id},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${user.id})`
      )
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Friendship already exists" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("friends")
      .insert({
        requester_id: user.id,
        recipient_id: recipientId,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error sending friend request:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send friend request" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, friendshipId: data?.id });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
