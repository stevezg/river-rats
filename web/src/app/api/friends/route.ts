import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/friends - Get all friends and pending requests
export async function GET(request: NextRequest) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    // Get accepted friendships with profile info
    const { data: friendships } = await supabase
      .from("friends")
      .select(
        `id, requester_id, recipient_id, created_at,
         requester:profiles!friends_requester_id_fkey(display_name),
         recipient:profiles!friends_recipient_id_fkey(display_name)`
      )
      .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .eq("status", "accepted")
      .order("created_at", { ascending: false });

    const friends =
      friendships?.map((f) => {
        const isRequester = f.requester_id === user.id;
        const friendId = isRequester ? f.recipient_id : f.requester_id;
        const profile = isRequester
          ? (f.recipient as { display_name?: string } | null)
          : (f.requester as { display_name?: string } | null);
        return {
          friendshipId: f.id,
          friendId,
          friendName: profile?.display_name ?? "Paddler",
          friendBio: null,
          friendsSince: f.created_at,
        };
      }) ?? [];

    // Get pending requests received
    const { data: pendingReceivedRows } = await supabase
      .from("friends")
      .select("id, requester_id, created_at, requester:profiles!friends_requester_id_fkey(display_name)")
      .eq("recipient_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const pendingReceived =
      pendingReceivedRows?.map((r) => ({
        friendshipId: r.id,
        requesterId: r.requester_id,
        requesterName:
          (r.requester as { display_name?: string } | null)?.display_name ??
          "Paddler",
        createdAt: r.created_at,
      })) ?? [];

    // Get pending requests sent
    const { data: pendingSentRows } = await supabase
      .from("friends")
      .select("id, recipient_id, created_at, recipient:profiles!friends_recipient_id_fkey(display_name)")
      .eq("requester_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const pendingSent =
      pendingSentRows?.map((s) => ({
        friendshipId: s.id,
        recipientId: s.recipient_id,
        recipientName:
          (s.recipient as { display_name?: string } | null)?.display_name ??
          "Paddler",
        createdAt: s.created_at,
      })) ?? [];

    return NextResponse.json({ friends, pendingReceived, pendingSent });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
