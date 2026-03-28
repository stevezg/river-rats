import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trips } from "@/lib/mock-data";
import { getRiverBySlug } from "@/lib/rivers";
import DifficultyBadge from "@/components/DifficultyBadge";
import FlowBadge from "@/components/FlowBadge";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return trips.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trip = trips.find((t) => t.id === id);
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.riverName} Trip — ${formatDate(trip.date)} | River Rats`,
    description: trip.notes.slice(0, 155),
  };
}

// Mock participants derived from trip data
function getParticipants(trip: (typeof trips)[0]) {
  const firstNames = ["Alex", "Sam", "Jordan", "Casey", "Morgan", "River", "Taylor"];
  const lastInitials = ["K.", "M.", "R.", "B.", "T.", "V.", "W."];
  const filled = trip.totalSpots - trip.spotsRemaining;
  return Array.from({ length: filled }, (_, i) => ({
    name: i === 0 ? trip.creatorName : `${firstNames[i % firstNames.length]} ${lastInitials[i % lastInitials.length]}`,
    isCreator: i === 0,
  }));
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const trip = trips.find((t) => t.id === id);
  if (!trip) notFound();

  const river = await getRiverBySlug(trip.riverSlug);
  const participants = getParticipants(trip);
  const isFull = trip.spotsRemaining === 0;

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
            <span style={{ color: "#8B8FA8" }}>{trip.riverName}</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={trip.difficulty} size="lg" />
                <span className="text-sm" style={{ color: "#8B8FA8" }}>
                  {trip.region}, {trip.state}
                </span>
              </div>
              <h1
                className="text-4xl font-bold text-white sm:text-5xl leading-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {trip.riverName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <FlowBadge cfs={trip.currentCfs} />
              </div>
            </div>

            {/* Join CTA — desktop */}
            <div className="hidden sm:flex flex-col items-end gap-2">
              <button
                className="rounded-xl px-8 py-3.5 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: isFull ? "#5c6070" : "#4ECDC4" }}
                disabled={isFull}
                aria-label={isFull ? "Trip is full" : "Request to join this trip"}
              >
                {isFull ? "Trip Full" : "Request to Join"}
              </button>
              {!isFull && (
                <p className="text-xs" style={{ color: "#8B8FA8" }}>
                  {trip.spotsRemaining} spot{trip.spotsRemaining !== 1 ? "s" : ""} remaining
                </p>
              )}
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
                    value: trip.meetingPoint,
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
                    value: `${trip.totalSpots - trip.spotsRemaining} / ${trip.totalSpots} filled`,
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
                <DifficultyBadge difficulty={trip.minSkill} size="sm" />
              </div>
            </section>

            {/* Trip notes */}
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
                Participants ({participants.length}/{trip.totalSpots})
              </h2>

              {/* Progress bar */}
              <div
                className="mb-5 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(participants.length / trip.totalSpots) * 100}%`,
                    backgroundColor: isFull ? "#FF6B6B" : "#4ECDC4",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: p.isCreator ? "#4ECDC4" : "rgba(78,205,196,0.15)",
                        color: p.isCreator ? "#0F1117" : "#4ECDC4",
                      }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{p.name}</span>
                      {p.isCreator && (
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
                ))}
                {Array.from({ length: trip.spotsRemaining }).map((_, i) => (
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
              <button
                className="w-full rounded-xl py-4 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: isFull ? "#5c6070" : "#4ECDC4" }}
                disabled={isFull}
              >
                {isFull ? "Trip Full" : "Request to Join"}
              </button>
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
                  {trip.creatorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{trip.creatorName}</p>
                  <div className="mt-1">
                    <DifficultyBadge difficulty={trip.creatorLevel} size="sm" />
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
                <button
                  className="flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors hover:text-white"
                  style={{
                    backgroundColor: "rgba(78,205,196,0.12)",
                    color: "#4ECDC4",
                  }}
                  aria-label="Copy share link"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Join CTA sticky sidebar */}
            <div className="hidden sm:block">
              <button
                className="w-full rounded-2xl py-4 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: isFull ? "#5c6070" : "#4ECDC4" }}
                disabled={isFull}
              >
                {isFull ? "Trip Full" : "Request to Join"}
              </button>
              {!isFull && (
                <p className="mt-2 text-center text-xs" style={{ color: "#8B8FA8" }}>
                  {trip.spotsRemaining} of {trip.totalSpots} spots remaining
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
