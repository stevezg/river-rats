import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

// POST /api/friends/cancel - Cancel a sent friend request
export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
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

    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", friendshipId)
      .eq("requester_id", user.id)
      .eq("status", "pending");

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
