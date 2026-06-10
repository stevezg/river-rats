import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";
import { riversData } from "@riverrats/shared";

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { riverSlug, date, time, meetingPoint, totalSpots, minSkill, notes } = body;

    if (!riverSlug || !date || !time || !meetingPoint) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const river = riversData.find((r) => r.slug === riverSlug);
    if (!river) {
      return NextResponse.json({ error: "Invalid river" }, { status: 400 });
    }

    const spots = parseInt(totalSpots, 10) || 6;
    const supabase = createServiceClient();

    const { data: trip, error: tripErr } = await supabase
      .from("trips")
      .insert({
        creator_id: user.id,
        river_slug: river.slug,
        river_name: river.name,
        date,
        time,
        meeting_point: meetingPoint,
        total_spots: spots,
        spots_remaining: spots,
        min_skill: minSkill || "III",
        notes: notes || null,
        status: "open",
      })
      .select("id")
      .single();

    if (tripErr || !trip) {
      return NextResponse.json(
        { error: tripErr?.message || "Failed to create trip" },
        { status: 500 }
      );
    }

    await supabase.from("trip_members").insert({
      trip_id: trip.id,
      user_id: user.id,
      role: "creator",
    });

    return NextResponse.json({ success: true, tripId: trip.id });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
