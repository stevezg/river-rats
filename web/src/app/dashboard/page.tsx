import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/profile";
import SignOutButton from "@/components/SignOutButton";

function getSkillColor(skill: string | null): string {
  switch (skill) {
    case "I-II": return "#52B788";
    case "III": case "III-IV": return "#FFA94D";
    case "IV": case "IV-V": return "#FF8C42";
    case "V": return "#FF6B6B";
    case "V+": return "#C62828";
    default: return "#8B8FA8";
  }
}

function getSkillBg(skill: string | null): string {
  switch (skill) {
    case "I-II": return "rgba(82, 183, 136, 0.15)";
    case "III": case "III-IV": return "rgba(255, 169, 77, 0.15)";
    case "IV": case "IV-V": return "rgba(255, 140, 66, 0.15)";
    case "V": return "rgba(255, 107, 107, 0.15)";
    case "V+": return "rgba(198, 40, 40, 0.15)";
    default: return "rgba(139, 143, 168, 0.15)";
  }
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const profile = await getOrCreateProfile(userId);
  if (!profile) redirect("/login");

  const { displayName, skillLevel, avatarUrl } = profile;

  return (
    <div
      className="min-h-[calc(100vh-64px)] px-4 py-12"
      style={{ backgroundColor: "#0F1117" }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-[#0F1117]"
              style={{
                backgroundColor: avatarUrl ? "transparent" : "#4ECDC4",
                backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
                backgroundSize: "cover",
              }}
            >
              {!avatarUrl && getInitials(displayName)}
            </div>

            <div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Welcome back, {displayName}!
              </h1>
              {skillLevel && (
                <span
                  className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: getSkillBg(skillLevel),
                    color: getSkillColor(skillLevel),
                  }}
                >
                  Class {skillLevel}
                </span>
              )}
            </div>
          </div>

          <SignOutButton />
        </div>

        {/* Quick links */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { href: "/rivers", label: "Browse Rivers", icon: "🌊" },
            { href: "/trips", label: "Find Trips", icon: "🛶" },
            { href: "/trips/new", label: "Post a Trip", icon: "+" },
            { href: "/friends", label: "Friends", icon: "🤙" },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl py-6 text-center text-sm font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "#1C1F26" }}
            >
              <span className="text-2xl">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* My Trips */}
        <section className="mb-6">
          <h2
            className="mb-4 text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            My Trips
          </h2>
          <div
            className="rounded-2xl px-6 py-12 text-center"
            style={{ backgroundColor: "#1C1F26" }}
          >
            <p className="mb-4 text-sm" style={{ color: "#8B8FA8" }}>
              You haven't posted any trips yet.
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              Post Your First Trip
            </Link>
          </div>
        </section>

        {/* Upcoming Trips */}
        <section>
          <h2
            className="mb-4 text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Upcoming Trips
          </h2>
          <div
            className="rounded-2xl px-6 py-12 text-center"
            style={{ backgroundColor: "#1C1F26" }}
          >
            <p className="mb-4 text-sm" style={{ color: "#8B8FA8" }}>
              No upcoming trips. Find paddlers and plan a run.
            </p>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/5 active:scale-[0.98]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              Browse Trips
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
