import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRiverBySlug } from "@/lib/rivers";
import DifficultyBadge from "@/components/DifficultyBadge";
import FlowBadge from "@/components/FlowBadge";
import JoinTripButton, { type JoinState } from "@/components/JoinTripButton";
import { formatDate } from "@/lib/utils";
import type { DifficultyClass } from "@/lib/trip-types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("river_name, date, notes")
    .eq("id", id)
    .single();
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.river_name} Trip — ${formatDate(trip.date)} | River Rats`,
    description: trip.notes?.slice(0, 155) ?? "",
  };
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: trip },
    { data: { user } },
  ] = await Promise.all([
    supabase
      .from("trips")
      .select(
        `id, river_slug, river_name, date, time, meeting_point, notes,
         min_skill, total_spots, spots_remaining, status,
         creator:profiles!creator_id(id, display_name, skill_level)`
      )
      .eq("id", id)
      .single(),
    supabase.auth.getUser(),
  ]);

  if (!trip) notFound();

  // Normalize creator (PostgREST one-to-one returns object)
  const creator = Array.isArray(trip.creator) ? trip.creator[0] : trip.creator;
  const creatorId = (creator as { id?: string } | null)?.id ?? null;
  const creatorName = (creator as { display_name?: string } | null)?.display_name ?? "Unknown";
  const creatorLevel = ((creator as { skill_level?: string } | null)?.skill_level ?? "III") as DifficultyClass;

  // Fetch river data and members in parallel
  const [river, { data: members }] = await Promise.all([
    getRiverBySlug(trip.river_slug),
    supabase
      .from("trip_members")
      .select("user_id, role, profiles(display_name, skill_level)")
      .eq("trip_id", id),
  ]);

  // Determine join state
  let joinState: JoinState = "open";
  if (!user) {
    joinState = "not-logged-in";
  } else if (creatorId === user.id) {
    joinState = "creator";
  } else if (trip.spots_remaining === 0) {
    joinState = "full";
  } else {
    // Check membership and pending request in parallel
    const [{ data: memberRow }, { data: reqRow }] = await Promise.all([
      supabase
        .from("trip_members")
        .select("id")
        .eq("trip_id", id)
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("join_requests")
        .select("id, status")
        .eq("trip_id", id)
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
    if (memberRow) {
      joinState = "member";
    } else if (reqRow) {
      joinState = "pending";
    }
  }

  const isFull = trip.spots_remaining === 0;
  const filledCount = trip.total_spots - trip.spots_remaining;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Hero */}
      <div
        className="border-b px-4 py-14 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(78, 205, 196, 0.10) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/trips" className="transition-colors hover:text-white" style={{ color: "#8B8FA8" }}>
              Trips
            </Link>
            <span style={{ color: "#5c6070" }}>/</span>
            <span style={{ color: "#8B8FA8" }}>{trip.river_name}</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={(river?.difficulty ?? "III") as DifficultyClass} size="lg" />
                {river && (
                  <span className="text-sm" style={{ color: "#8B8FA8" }}>
                    {river.region}, {river.state}
                  </span>
                )}
              </div>
              <h1
                className="text-4xl font-bold text-white sm:text-5xl leading-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {trip.river_name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {river && <FlowBadge cfs={river.currentCfs} trend={river.trend} />}
              </div>
            </div>

            {/* Join CTA — desktop */}
            <div className="hidden sm:block w-52">
              <JoinTripButton
                tripId={trip.id}
                initialState={joinState}
                spotsRemaining={trip.spots_remaining}
                totalSpots={trip.total_spots}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Trip details */}
            <section
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "#1C1F26",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <h2
                className="mb-5 text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Trip Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    ),
                    label: "Date",
                    value: formatDate(trip.date),
                  },
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                    label: "Meet time",
                    value: trip.time,
                  },
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: "Meeting point",
                    value: trip.meeting_point,
                  },
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    ),
                    label: "Group size",
                    value: `${filledCount} / ${trip.total_spots} filled`,
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0" style={{ color: "#4ECDC4" }}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "#8B8FA8" }}>{label}</p>
                      <p className="text-sm font-medium text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Min skill */}
              <div
                className="mt-5 flex items-center gap-3 rounded-xl border p-3"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFA94D" strokeWidth="2" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-sm" style={{ color: "#8B8FA8" }}>
                  Minimum skill level:
                </span>
                <DifficultyBadge difficulty={trip.min_skill as DifficultyClass} size="sm" />
              </div>
            </section>

            {/* Trip notes */}
            {trip.notes && (
              <section>
                <h2
                  className="mb-4 text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Notes from the organizer
                </h2>
                <p className="leading-relaxed text-base" style={{ color: "#8B8FA8" }}>
                  {trip.notes}
                </p>
              </section>
            )}

            {/* Participants */}
            <section
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "#1C1F26",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <h2
                className="mb-5 text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Participants ({filledCount}/{trip.total_spots})
              </h2>

              {/* Progress bar */}
              <div
                className="mb-5 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(filledCount / trip.total_spots) * 100}%`,
                    backgroundColor: isFull ? "#FF6B6B" : "#4ECDC4",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                {(members ?? []).map((m, i) => {
                  const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
                  const name = (profile as { display_name?: string } | null)?.display_name ?? "Paddler";
                  const isCreatorRow = m.role === "creator";
                  return (
                    <div key={m.user_id ?? i} className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: isCreatorRow ? "#4ECDC4" : "rgba(78,205,196,0.15)",
                          color: isCreatorRow ? "#0F1117" : "#4ECDC4",
                        }}
                      >
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white">{name}</span>
                        {isCreatorRow && (
                          <span
                            className="ml-2 rounded-full px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor: "rgba(78,205,196,0.12)",
                              color: "#4ECDC4",
                            }}
                          >
                            Organizer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {Array.from({ length: trip.spots_remaining }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px dashed rgba(255,255,255,0.12)",
                        color: "#5c6070",
                      }}
                    >
                      +
                    </div>
                    <span className="text-sm" style={{ color: "#5c6070" }}>
                      Open spot
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Mobile CTA */}
            <div className="sm:hidden">
              <JoinTripButton
                tripId={trip.id}
                initialState={joinState}
                spotsRemaining={trip.spots_remaining}
                totalSpots={trip.total_spots}
                className="w-full"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Creator card */}
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
                Organizer
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-[#0F1117]"
                  style={{ backgroundColor: "#4ECDC4" }}
                >
                  {creatorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{creatorName}</p>
                  <div className="mt-1">
                    <DifficultyBadge difficulty={creatorLevel} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* River link */}
            {river && (
              <Link
                href={`/rivers/${river.slug}`}
                className="group rounded-2xl border p-5 transition-all hover:border-[rgba(78,205,196,0.20)] block"
                style={{
                  backgroundColor: "#1C1F26",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <h3
                  className="mb-2 text-sm font-medium"
                  style={{ color: "#8B8FA8", fontFamily: "var(--font-space-grotesk)" }}
                >
                  River info
                </h3>
                <p className="font-semibold text-white group-hover:text-[#4ECDC4] transition-colors">
                  {river.name}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <DifficultyBadge difficulty={river.difficulty} size="sm" />
                  <FlowBadge cfs={river.currentCfs} trend={river.trend} />
                </div>
                <p
                  className="mt-3 text-xs flex items-center gap-1 transition-colors group-hover:text-[#4ECDC4]"
                  style={{ color: "#8B8FA8" }}
                >
                  View river details
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </p>
              </Link>
            )}

            {/* Share section */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "#1C1F26",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <h3
                className="mb-3 text-base font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Share this trip
              </h3>
              <div
                className="flex items-center gap-2 rounded-xl border p-3 text-xs font-mono"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "#8B8FA8",
                }}
              >
                <span className="flex-1 truncate">riverrats.app/trips/{trip.id}</span>
              </div>
            </div>

            {/* Join CTA sticky sidebar */}
            <div className="hidden sm:block">
              <JoinTripButton
                tripId={trip.id}
                initialState={joinState}
                spotsRemaining={trip.spots_remaining}
                totalSpots={trip.total_spots}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
