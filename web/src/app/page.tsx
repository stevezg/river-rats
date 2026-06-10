import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronRight, MessageCircle, Plus, Waves } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";
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
  { href: "/runs", label: "Runs", icon: Waves },
  { href: "/trips", label: "Trips", icon: CalendarDays },
  { href: "/trips/new", label: "Create", icon: Plus },
  { href: "/messages", label: "Messages", icon: MessageCircle },
];

export default async function HomePage() {
  const supabase = createServiceClient();

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
          )}
        </div>
      </section>

      {/* Features — marketing only, hide for logged-in users */}
      {!user && (
        <section
          className="px-4 py-24 sm:px-6 lg:px-8"
          style={{ background: "linear-gradient(180deg, #0F1117 0%, rgba(28,31,38,0.5) 50%, #0F1117 100%)" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Built around how paddlers actually operate
              </h2>
              <p className="mt-3 text-lg" style={{ color: "#8B8FA8" }}>
                Flows change fast. Your crew needs to move faster.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border p-7 transition-all duration-200 hover:border-[rgba(78,205,196,0.20)]"
                  style={{ backgroundColor: "#1C1F26", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(78, 205, 196, 0.12)", color: "#4ECDC4" }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8B8FA8" }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Rivers */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Rivers live now
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
                Real-time CFS from USGS gauges
              </p>
            </div>
            <Link href="/rivers" className="flex items-center gap-1 text-sm font-medium text-[#4ECDC4] transition-colors hover:text-[#3db8b0]">
              View all {rivers.length} rivers
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
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
                <h2 className="text-2xl font-bold text-white">Runs</h2>
                <p className="mt-1 text-sm text-[#8B8FA8]">Colorado gauges that matter today.</p>
              </div>
              <Link href="/runs" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4ECDC4]">
                All runs
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

      {/* How it works + CTA band — marketing only, hidden for logged-in users */}
      {!user && (
        <>
          <section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  The loop
                </h2>
                <p className="mt-3" style={{ color: "#8B8FA8" }}>
                  From flow spike to launch in under an hour.
                </p>
              </div>
              <div className="relative grid gap-8 sm:grid-cols-3">
                <div
                  className="absolute left-0 right-0 top-6 hidden h-px sm:block"
                  style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
                  aria-hidden="true"
                />
                {steps.map((s) => (
                  <div key={s.step} className="relative flex flex-col items-center text-center">
                    <div
                      className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold"
                      style={{ backgroundColor: "#0F1117", borderColor: "#4ECDC4", color: "#4ECDC4", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {s.step}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#8B8FA8" }}>{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="mx-4 mb-24 rounded-2xl px-8 py-16 text-center sm:mx-6 lg:mx-8"
            style={{
              background: "linear-gradient(135deg, rgba(78, 205, 196, 0.12) 0%, rgba(82, 183, 136, 0.08) 100%)",
              border: "1px solid rgba(78, 205, 196, 0.20)",
            }}
          >
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Your next run is waiting
              </h2>
              <p className="mt-4 text-lg" style={{ color: "#8B8FA8" }}>
                {rivers.length} rivers tracked. {runnableCount} running right now. The only thing missing is your crew.
              </p>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm flex-wrap" style={{ color: "#8B8FA8" }}>
                {["Class II beginners to Class V experts", "Free forever", "No credit card"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="rounded-full px-8 py-3.5 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ backgroundColor: "#4ECDC4" }}
                >
                  Join the Community
                </Link>
                <Link
                  href="/rivers"
                  className="rounded-full border px-8 py-3.5 text-base font-medium transition-all hover:border-white/20"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "#8B8FA8" }}
                >
                  Browse Rivers
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
