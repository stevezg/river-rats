import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronRight, MessageCircle, Plus, Waves } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { createPublicClient } from "@/lib/supabase/public";
import { getRivers } from "@/lib/rivers";
import DifficultyBadge from "@/components/DifficultyBadge";
import FlowBadge from "@/components/FlowBadge";
import TripCard from "@/components/TripCard";
import type { DifficultyClass, TripSummary } from "@/lib/trip-types";

export const metadata: Metadata = {
  title: "RiverRat Colorado Beta",
  description: "Live Colorado river runs, trips, and crew messages for paddlers.",
};

const betaTabs = [
  { href: "/rivers", label: "Rivers", icon: Waves },
  { href: "/trips", label: "Trips", icon: CalendarDays },
  { href: "/trips/new", label: "Create", icon: Plus },
  { href: "/messages", label: "Messages", icon: MessageCircle },
];

export default async function HomePage() {
  const supabase = createPublicClient();

  const [user, rivers, { data: recentTripsRaw }] = await Promise.all([
    getSession(),
    getRivers(),
    supabase
      .from("trips")
      .select(
        `id, river_slug, river_name, date, time, meeting_point, notes,
         min_skill, total_spots, spots_remaining,
         creator:profiles!creator_id(display_name, skill_level)`
      )
      .in("status", ["open", "full"])
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .limit(3),
  ]);

  const coloradoRivers = rivers
    .filter((river) => river.state === "CO")
    .sort((a, b) => Number(b.runnable) - Number(a.runnable) || b.currentCfs - a.currentCfs);
  const runnableRivers = coloradoRivers.filter((river) => river.runnable);
  const riverMap = new Map(rivers.map((river) => [river.slug, river]));

  const recentTrips: TripSummary[] = (recentTripsRaw ?? [])
    .filter((trip) => riverMap.get(trip.river_slug)?.state === "CO")
    .map((trip) => {
      const river = riverMap.get(trip.river_slug);
      const creator = Array.isArray(trip.creator) ? trip.creator[0] : trip.creator;

      return {
        id: trip.id,
        riverSlug: trip.river_slug,
        riverName: trip.river_name,
        difficulty: (river?.difficulty ?? "III") as DifficultyClass,
        date: trip.date,
        time: trip.time,
        meetingPoint: trip.meeting_point,
        notes: trip.notes ?? "",
        minSkill: trip.min_skill as DifficultyClass,
        creatorName: (creator as { display_name?: string } | null)?.display_name ?? "Paddler",
        creatorLevel: ((creator as { skill_level?: string } | null)?.skill_level ?? "III") as DifficultyClass,
        totalSpots: trip.total_spots,
        spotsRemaining: trip.spots_remaining,
        currentCfs: river?.currentCfs ?? 0,
        region: river?.region ?? "",
        state: river?.state ?? "",
      };
    });

  const primaryRun = runnableRivers[0] ?? coloradoRivers[0];

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <section className="border-b border-white/[0.06] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#4ECDC4]/30 bg-[#4ECDC4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4ECDC4]">
                Colorado beta
              </span>
              <span className="text-sm text-[#8B8FA8]">
                {runnableRivers.length} of {coloradoRivers.length} Colorado runs are in range
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              The river is in. Who&apos;s going?
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-[#8B8FA8]">
              RiverRat turns live Colorado flow windows into crew plans: see what is runnable, create a trip, and message the paddlers joining you.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {betaTabs.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-colors hover:border-[#4ECDC4]/40 hover:text-[#4ECDC4]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {primaryRun && (
            <Link
              href={`/rivers/${primaryRun.slug}`}
              className="rounded-lg border border-[#4ECDC4]/25 bg-[#17232A] p-5 transition-colors hover:border-[#4ECDC4]/50"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[#4ECDC4]">Best window now</span>
                <FlowBadge cfs={primaryRun.currentCfs} compact />
              </div>
              <h2 className="text-2xl font-bold text-white">{primaryRun.name.split(" — ")[0]}</h2>
              <p className="mt-1 text-sm text-[#8B8FA8]">{primaryRun.region}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-md bg-white/[0.04] p-3">
                  <p className="text-[#5c6070]">Class</p>
                  <div className="mt-1">
                    <DifficultyBadge difficulty={primaryRun.difficulty} size="sm" inline />
                  </div>
                </div>
                <div className="rounded-md bg-white/[0.04] p-3">
                  <p className="text-[#5c6070]">Flow</p>
                  <p className="mt-1 font-semibold text-white">{primaryRun.currentCfs.toLocaleString()} CFS</p>
                </div>
                <div className="rounded-md bg-white/[0.04] p-3">
                  <p className="text-[#5c6070]">Status</p>
                  <p className="mt-1 font-semibold text-white">{primaryRun.runnable ? "In" : "Watch"}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Rivers</h2>
                <p className="mt-1 text-sm text-[#8B8FA8]">Colorado gauges that matter today.</p>
              </div>
              <Link href="/rivers" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4ECDC4]">
                All rivers
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {coloradoRivers.slice(0, 6).map((river) => (
                <Link
                  key={river.slug}
                  href={`/rivers/${river.slug}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-[#1C1F26] p-4 transition-colors hover:border-white/15"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{river.name.split(" — ")[0]}</p>
                    <p className="mt-1 text-xs text-[#8B8FA8]">
                      {river.region} · Class {river.difficulty}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={river.runnable ? "text-sm font-bold text-[#4ECDC4]" : "text-sm font-bold text-white"}>
                      {river.currentCfs.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase text-[#5c6070]">CFS</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Trips</h2>
                <p className="mt-1 text-sm text-[#8B8FA8]">Crews forming next.</p>
              </div>
              <Link href="/trips/new" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4ECDC4]">
                Create
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {recentTrips.length > 0 ? (
              <div className="grid gap-4">
                {recentTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isLoggedIn={!!user} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-6">
                <p className="font-semibold text-white">No Colorado trips posted yet.</p>
                <p className="mt-2 text-sm leading-6 text-[#8B8FA8]">
                  When the gauge turns green, be the first one to call the crew.
                </p>
                <Link
                  href={user ? "/trips/new" : "/login?next=/trips/new"}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#4ECDC4] px-4 text-sm font-semibold text-[#0F1117]"
                >
                  Create a trip
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
