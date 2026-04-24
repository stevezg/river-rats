import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getProfileId } from "@/lib/profile";

// GET /api/friends — all friends and pending requests for the current user
export async function GET(_request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileId = await getProfileId(userId);
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const supabase = createServiceClient();

  const { data: rows } = await supabase
    .from("friends")
    .select(
      `id, requester_id, recipient_id, status, created_at,
       requester:profiles!friends_requester_id_fkey(id, display_name, bio),
       recipient:profiles!friends_recipient_id_fkey(id, display_name, bio)`
    )
    .or(`requester_id.eq.${profileId},recipient_id.eq.${profileId}`);

  const friends = [];
  const pendingReceived = [];
  const pendingSent = [];

  for (const row of rows ?? []) {
    const req = row.requester as { id: string; display_name: string; bio: string | null } | null;
    const rec = row.recipient as { id: string; display_name: string; bio: string | null } | null;

    if (row.status === "accepted") {
      const isRequester = row.requester_id === profileId;
      friends.push({
        friendshipId: row.id,
        friendId: isRequester ? row.recipient_id : row.requester_id,
        friendName: isRequester ? rec?.display_name : req?.display_name,
        friendBio: isRequester ? rec?.bio : req?.bio,
        friendsSince: row.created_at,
      });
    } else if (row.status === "pending") {
      if (row.requester_id === profileId) {
        pendingSent.push({
          friendshipId: row.id,
          recipientId: row.recipient_id,
          recipientName: rec?.display_name,
          createdAt: row.created_at,
        });
      } else {
        pendingReceived.push({
          friendshipId: row.id,
          requesterId: row.requester_id,
          requesterName: req?.display_name,
          createdAt: row.created_at,
        });
      }
    }
  }

  return NextResponse.json({ friends, pendingReceived, pendingSent });
}
