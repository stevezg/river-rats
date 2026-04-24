import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile";
import { riversData } from "@riverrats/shared";

// POST /api/trips — create a new trip (day, overnight, or expedition)
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getOrCreateProfile(userId);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json();
  const {
    riverSlug,
    date,
    time,
    meetingPoint,
    totalSpots,
    minSkill,
    notes,
    tripType = "day",
    endDate,
  } = body;

  if (!riverSlug || !date || !time || !meetingPoint || !totalSpots || !minSkill) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
  }

  const river = riversData.find((r) => r.slug === riverSlug);
  if (!river) {
    return NextResponse.json({ error: "Invalid river" }, { status: 422 });
  }

  if (tripType !== "day" && !endDate) {
    return NextResponse.json({ error: "end_date required for overnight/expedition trips" }, { status: 422 });
  }

  const spots = parseInt(String(totalSpots), 10);
  if (isNaN(spots) || spots < 1 || spots > 20) {
    return NextResponse.json({ error: "totalSpots must be 1-20" }, { status: 422 });
  }

  const supabase = createServiceClient();

  const { data: trip, error: tripErr } = await supabase
    .from("trips")
    .insert({
      creator_id: profile.id,
      river_slug: river.slug,
      river_name: river.name,
      date,
      time,
      meeting_point: meetingPoint,
      total_spots: spots,
      spots_remaining: spots,
      min_skill: minSkill,
      notes: notes || null,
      status: "open",
      trip_type: tripType,
      end_date: tripType !== "day" ? endDate : null,
    })
    .select("id")
    .single();

  if (tripErr || !trip) {
    return NextResponse.json({ error: tripErr?.message ?? "Failed to create trip" }, { status: 500 });
  }

  await supabase.from("trip_members").insert({
    trip_id: trip.id,
    user_id: profile.id,
    role: "creator",
  });

  return NextResponse.json({ tripId: trip.id });
}
