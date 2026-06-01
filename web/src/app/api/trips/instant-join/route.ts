import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tripId } = await request.json();
    if (!tripId) {
      return NextResponse.json(
        { error: "tripId required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Check trip is open and has spots
    const { data: trip } = await supabase
      .from("trips")
      .select("id, status, spots_remaining, quick_join_enabled")
      .eq("id", tripId)
      .single();

    if (!trip || trip.status !== "open" || trip.spots_remaining <= 0) {
      return NextResponse.json(
        { error: "Trip is not available for instant join" },
        { status: 400 }
      );
    }

    if (!trip.quick_join_enabled) {
      return NextResponse.json(
        { error: "Quick join is not enabled for this trip" },
        { status: 400 }
      );
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from("trip_members")
      .select("id")
      .eq("trip_id", tripId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember) {
      return NextResponse.json(
        { error: "Already a member of this trip" },
        { status: 409 }
      );
    }

    // Add member and decrement spots
    await supabase.from("trip_members").insert({
      trip_id: tripId,
      user_id: user.id,
      role: "member",
    });

    await supabase
      .from("trips")
      .update({
        spots_remaining: trip.spots_remaining - 1,
        status: trip.spots_remaining - 1 === 0 ? "full" : "open",
      })
      .eq("id", tripId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Instant join error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
