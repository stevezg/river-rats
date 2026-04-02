import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRivers } from "@/lib/rivers";
import FlowBadge from "@/components/FlowBadge";
import DifficultyBadge from "@/components/DifficultyBadge";
import TripCard from "@/components/TripCard";
import type { TripSummary, DifficultyClass } from "@/lib/trip-types";

export const metadata: Metadata = {
  title: "River Rats — Never Run a River Alone",
  description:
    "Find paddling partners at your skill level, check live river flows, and build your whitewater resume. The social platform for kayakers.",
};

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Find Your Crew",
    description: "Match with paddlers at your skill level in your region. Filter by class rating, river, and schedule. No more solo runs because you couldn't find anyone.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 8c3-3 6 0 9-3s6 3 9 0"/>
        <path d="M3 14c3-3 6 0 9-3s6 3 9 0"/>
        <path d="M3 20c3-3 6 0 9-3s6 3 9 0"/>
      </svg>
    ),
    title: "Live Flow Data",
    description: "Real-time CFS from USGS gauges on every river. Know before you go whether it's too low, perfect, or blown out. Set alerts for your favorite runs.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Never Paddle Alone",
    description: "Whitewater alone is dangerous. River Rats is your safety network — post a trip when conditions are prime and your crew assembles in minutes.",
  },
];

const steps = [
  {
    step: "01",
    title: "Check the Flow",
    description: "Flows just spiked into the optimal range on your home river. River Rats notifies you instantly.",
  },
  {
    step: "02",
    title: "Post a Trip",
    description: "Tap Post, pick the river, set a time and skill requirement. Takes 30 seconds. Paddlers nearby see it immediately.",
  },
  {
    step: "03",
    title: "Paddle with a Crew",
    description: "Your crew forms, you launch with partners at your level. No more waiting — when it's running, you're on it.",
  },
];

const FEATURED_SLUGS = [
  "arkansas-royal-gorge",
  "colorado-glenwood",
  "clear-creek",
  "animas-river",
];

export default async function HomePage() {
  // Fetch live data in parallel
  const supabase = await createClient();

  const [rivers, { count: tripCount }, { data: recentTripsRaw }, { data: { user } }] = await Promise.all([
    getRivers(),
    supabase.from("trips").select("*", { count: "exact", head: true }).gte("date", new Date().toISOString().slice(0, 10)),
    supabase
      .from("trips")
      .select(`id, river_slug, river_name, date, time, meeting_point, notes, min_skill, total_spots, spots_remaining, creator:profiles!creator_id(display_name, skill_level)`)
      .in("status", ["open", "full"])
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.auth.getUser(),
  ]);

  const riverMap = new Map(rivers.map((r) => [r.slug, r]));
  const featuredRivers = FEATURED_SLUGS.map((s) => riverMap.get(s)).filter(Boolean);
  const runnableCount = rivers.filter((r) => r.runnable).length;

  const recentTrips: TripSummary[] = (recentTripsRaw ?? []).map((t) => {
    const river = riverMap.get(t.river_slug);
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
      creatorName: (creator as { display_name?: string } | null)?.display_name ?? "Paddler",
      creatorLevel: ((creator as { skill_level?: string } | null)?.skill_level ?? "III") as DifficultyClass,
      totalSpots: t.total_spots,
      spotsRemaining: t.spots_remaining,
      currentCfs: river?.currentCfs ?? 0,
      region: river?.region ?? "",
      state: river?.state ?? "",
    };
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(78, 205, 196, 0.15) 0%, transparent 60%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Live badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{ borderColor: "rgba(78, 205, 196, 0.30)", backgroundColor: "rgba(78, 205, 196, 0.08)", color: "#4ECDC4" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
            {runnableCount} rivers running now · {rivers.length} rivers tracked
          </div>

          <h1
            className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Never run a river{" "}
            <span
              className="relative"
              style={{
                background: "linear-gradient(135deg, #4ECDC4, #52B788)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              alone.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl" style={{ color: "#8B8FA8" }}>
            Flows up. Post a trip. Find a crew in minutes.{" "}
            <span className="text-white">The real-time paddling partner platform</span> — built for whitewater kayakers who don't want to wait.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={user ? "/trips/new" : "/signup"}
              className="rounded-full px-8 py-4 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              {user ? "Post a Trip" : "Get Started — Free"}
            </Link>
            <Link
              href="/trips"
              className="rounded-full border px-8 py-4 text-base font-medium transition-all hover:border-white/20 hover:text-white"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "#8B8FA8" }}
            >
              Browse the Feed
            </Link>
          </div>

          {/* Live river pills */}
          {featuredRivers.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {featuredRivers.slice(0, 4).map((river) => (
                <Link
                  key={river!.slug}
                  href={`/rivers/${river!.slug}`}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all hover:border-white/20"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="font-medium text-white">{river!.name.split(" — ")[0]}</span>
                  <FlowBadge cfs={river!.currentCfs} compact />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredRivers.map((river) => (
              <Link
                key={river!.slug}
                href={`/rivers/${river!.slug}`}
                className="flex items-center justify-between rounded-xl border p-4 transition-all hover:border-white/12"
                style={{ backgroundColor: "#1C1F26", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white leading-snug truncate">{river!.name.split(" — ")[0]}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8B8FA8" }}>
                    {river!.state} · <DifficultyBadge difficulty={river!.difficulty} size="sm" inline />
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-[#4ECDC4]">{river!.currentCfs.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: "#8B8FA8" }}>CFS</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent trips (only if there are some) */}
      {recentTrips.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Trips happening now
                </h2>
                <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
                  {tripCount ?? 0} open trips · join a crew or post your own
                </p>
              </div>
              <Link href="/trips" className="flex items-center gap-1 text-sm font-medium text-[#4ECDC4] transition-colors hover:text-[#3db8b0]">
                View all trips
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isLoggedIn={!!user} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
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

      {/* CTA band */}
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
    </div>
  );
}
