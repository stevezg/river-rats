import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRiverBySlug } from "@/lib/rivers";
import { riversData } from "@/lib/rivers-data";
import { fetchDailyFlow } from "@/lib/usgs-daily";
import { fetchFlowPercentile, getLabelColor } from "@/lib/usgs-stats";
import { createClient } from "@/lib/supabase/server";
import DifficultyBadge from "@/components/DifficultyBadge";
import FlowBadge from "@/components/FlowBadge";
import FlowSparkline from "@/components/FlowSparkline";
import TripCard from "@/components/TripCard";
import { getFlowStatus, getTrendIcon, getTrendColor } from "@/lib/utils";
import type { TripSummary, DifficultyClass } from "@/lib/trip-types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return riversData.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const river = riversData.find((r) => r.slug === slug);
  if (!river) return { title: "River Not Found" };
  return {
    title: `${river.name} — Class ${river.difficulty} | River Rats`,
    description: `${river.description.slice(0, 155)}...`,
  };
}

export default async function RiverDetailPage({ params }: Props) {
  const { slug } = await params;
  const river = await getRiverBySlug(slug);
  if (!river) notFound();

  const [dailyFlow, percentile, supabase] = await Promise.all([
    fetchDailyFlow(river.gaugeId, 7),
    fetchFlowPercentile(river.gaugeId, river.currentCfs),
    createClient(),
  ]);

  const { data: rawTrips } = await supabase
    .from("trips")
    .select(`id, river_slug, river_name, date, time, meeting_point, notes, min_skill, total_spots, spots_remaining, creator:profiles!creator_id(display_name, skill_level)`)
    .eq("river_slug", slug)
    .in("status", ["open", "full"])
    .order("date", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const relatedTrips: TripSummary[] = (rawTrips ?? []).map((t) => {
    const creator = Array.isArray(t.creator) ? t.creator[0] : t.creator;
    return {
      id: t.id,
      riverSlug: t.river_slug,
      riverName: t.river_name,
      difficulty: river.difficulty,
      date: t.date,
      time: t.time,
      meetingPoint: t.meeting_point,
      notes: t.notes ?? "",
      minSkill: t.min_skill as DifficultyClass,
      creatorName: (creator as { display_name?: string } | null)?.display_name ?? "Unknown",
      creatorLevel: ((creator as { skill_level?: string } | null)?.skill_level ?? "III") as DifficultyClass,
      totalSpots: t.total_spots,
      spotsRemaining: t.spots_remaining,
      currentCfs: river.currentCfs,
      region: river.region,
      state: river.state,
    };
  });

  const flowStatus = getFlowStatus(river.currentCfs, river.optimalMin, river.optimalMax);
  const trendIcon = getTrendIcon(river.trend);
  const trendColor = getTrendColor(river.trend);
  const flowPct = Math.min(
    100,
    Math.max(0, ((river.currentCfs - river.optimalMin) / (river.optimalMax - river.optimalMin)) * 100)
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Hero */}
      <div
        className="relative border-b px-4 py-14 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(78, 205, 196, 0.12) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/rivers" className="transition-colors hover:text-white" style={{ color: "#8B8FA8" }}>
              Rivers
            </Link>
            <span style={{ color: "#5c6070" }}>/</span>
            <span style={{ color: "#8B8FA8" }}>{river.name}</span>
          </nav>

          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={river.difficulty} size="lg" />
                <span className="text-sm" style={{ color: "#8B8FA8" }}>
                  {river.region}, {river.state}
                </span>
              </div>
              <h1
                className="text-4xl font-bold text-white sm:text-5xl leading-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {river.name}
              </h1>
            </div>

            <Link
              href={`/trips?river=${river.slug}`}
              className="flex-shrink-0 rounded-xl px-6 py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              Post a Trip
            </Link>
          </div>

          {/* Flow hero stats */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <FlowBadge
              cfs={river.currentCfs}
              optimalMin={river.optimalMin}
              optimalMax={river.optimalMax}
              trend={river.trend}
              showStatus
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Description */}
            <section>
              <h2
                className="mb-4 text-xl font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                About this run
              </h2>
              <p className="leading-relaxed text-base" style={{ color: "#8B8FA8" }}>
                {river.description}
              </p>
            </section>

            {/* Hazards */}
            <section
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.06)",
                borderColor: "rgba(255, 107, 107, 0.20)",
              }}
            >
              <h2
                className="mb-4 flex items-center gap-2 text-lg font-semibold"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "#FF6B6B" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Known Hazards
              </h2>
              <ul className="flex flex-col gap-2.5">
                {river.hazards.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "#8B8FA8" }}>
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: "#FF6B6B" }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            {/* Upcoming trips */}
            {relatedTrips.length > 0 && (
              <section>
                <h2
                  className="mb-5 text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Upcoming trips on this river
                </h2>
                <div className="flex flex-col gap-4">
                  {relatedTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} isLoggedIn={!!user} />
                  ))}
                </div>
              </section>
            )}

            {relatedTrips.length === 0 && (
              <section
                className="rounded-2xl border p-8 text-center"
                style={{
                  backgroundColor: "#1C1F26",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-base font-medium text-white">No trips posted yet</p>
                <p className="mt-1 text-sm" style={{ color: "#8B8FA8" }}>
                  Be the first to organize a trip on this river.
                </p>
                <Link
                  href="/trips"
                  className="mt-4 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90"
                  style={{ backgroundColor: "#4ECDC4" }}
                >
                  Post a Trip
                </Link>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Flow card */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "#1C1F26",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <h3
                className="mb-4 text-base font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Current Flow
              </h3>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#4ECDC4]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {river.currentCfs.toLocaleString()}
                  </span>
                  <span className="text-sm" style={{ color: "#8B8FA8" }}>CFS</span>
                  <span className="text-lg font-bold" style={{ color: trendColor }}>
                    {trendIcon}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium capitalize" style={{ color: trendColor }}>
                  {river.trend}
                </p>
              </div>

              {/* Flow gauge bar */}
              <div className="mb-3">
                <div className="mb-1.5 flex items-center justify-between text-xs" style={{ color: "#8B8FA8" }}>
                  <span>Too Low</span>
                  <span>Optimal Range</span>
                  <span>High</span>
                </div>
                <div
                  className="relative h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  {/* Optimal range indicator */}
                  <div
                    className="absolute top-0 h-full rounded-full opacity-30"
                    style={{
                      left: "25%",
                      width: "50%",
                      backgroundColor: "#52B788",
                    }}
                    aria-hidden="true"
                  />
                  {/* Current marker */}
                  <div
                    className="absolute top-0 h-full w-1 rounded-full"
                    style={{
                      left: `${Math.max(2, Math.min(97, flowPct + 20))}%`,
                      backgroundColor: flowStatus.color,
                    }}
                    aria-label={`Current flow at ${flowPct.toFixed(0)}% of optimal range`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { label: "Current", value: `${river.currentCfs.toLocaleString()} CFS` },
                  { label: "Optimal Min", value: `${river.optimalMin.toLocaleString()} CFS` },
                  { label: "Optimal Max", value: `${river.optimalMax.toLocaleString()} CFS` },
                  { label: "Status", value: flowStatus.label, color: flowStatus.color },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span style={{ color: "#8B8FA8" }}>{label}</span>
                    <span className="font-medium" style={{ color: color ?? "#FFFFFF" }}>
                      {value}
                    </span>
                  </div>
                ))}

                {percentile && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#8B8FA8" }}>Percentile (today)</span>
                    <span className="font-medium" style={{ color: getLabelColor(percentile.label) }}>
                      ~{percentile.percentile}th · {percentile.label}
                    </span>
                  </div>
                )}

                {river.tempC !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#8B8FA8" }}>Water Temp</span>
                    <span className="font-medium text-white">
                      {river.tempC.toFixed(1)}°C / {(river.tempC * 9/5 + 32).toFixed(0)}°F
                    </span>
                  </div>
                )}
              </div>

              {dailyFlow.length >= 2 && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="mb-2 text-xs font-medium" style={{ color: "#8B8FA8" }}>7-Day Flow</p>
                  <FlowSparkline
                    points={dailyFlow}
                    optimalMin={river.optimalMin}
                    optimalMax={river.optimalMax}
                  />
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "#1C1F26",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <h3
                className="mb-4 text-base font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                River Info
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Region", value: river.region },
                  { label: "State", value: river.state },
                  { label: "Difficulty", value: `Class ${river.difficulty}` },
                  { label: "USGS Gauge", value: river.gaugeId },
                  { label: "Runnable", value: river.runnable ? "Yes" : "No" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span style={{ color: "#8B8FA8" }}>{label}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/trips"
              className="w-full rounded-2xl py-4 text-center text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              Post a Trip on this River
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
