import { createClient } from "@/lib/supabase/server";
import { getRivers } from "@/lib/rivers";
import TripsClient from "@/components/TripsClient";
import type { TripSummary, DifficultyClass } from "@/lib/trip-types";

export const revalidate = 60; // revalidate every minute

export default async function TripsPage() {
  const supabase = await createClient();

  const [
    { data: { user } },
    { data: rawTrips },
    rivers,
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("trips")
      .select(
        `id, river_slug, river_name, date, time, meeting_point, notes,
         min_skill, total_spots, spots_remaining, status,
         creator:profiles!creator_id(display_name, skill_level)`
      )
      .in("status", ["open", "full"])
      .order("date", { ascending: true }),
    getRivers(),
  ]);

  const riverMap = new Map(rivers.map((r) => [r.slug, r]));

  const trips: TripSummary[] = (rawTrips ?? []).map((t) => {
    const river = riverMap.get(t.river_slug);
    // PostgREST returns the FK join as an object (one-to-one)
    const creator = Array.isArray(t.creator) ? t.creator[0] : t.creator;
    return {
      id: t.id,
      riverSlug: t.river_slug,
      riverName: t.river_name,
      difficulty: (river?.difficulty ?? "III") as DifficultyClass,
      date: t.date,
      time: t.time,
      meetingPoint: t.meeting_point,
      notes: t.notes ?? "",
      minSkill: t.min_skill as DifficultyClass,
      creatorName: (creator as { display_name?: string } | null)?.display_name ?? "Unknown",
      creatorLevel: ((creator as { skill_level?: string } | null)?.skill_level ?? "III") as DifficultyClass,
      totalSpots: t.total_spots,
      spotsRemaining: t.spots_remaining,
      currentCfs: river?.currentCfs ?? 0,
      region: river?.region ?? "",
      state: river?.state ?? "",
    };
  });

  return <TripsClient trips={trips} isLoggedIn={!!user} />;
}
