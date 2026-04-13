import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";
import Link from "next/link";
import { Calendar, Users, Droplets } from "lucide-react";

export const metadata = {
  title: "Dashboard | River Rats",
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session.userId) {
    redirect("/login");
  }

  const user = await currentUser();
  const userId = session.userId;
  const supabase = createServiceClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, skill_level, bio")
    .eq("id", userId)
    .single();

  // Fetch user's trips
  const { data: myTrips } = await supabase
    .from("trips")
    .select("id, river_name, date, spots_remaining")
    .eq("creator_id", userId)
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .limit(5);

  // Fetch trips user is attending
  const { data: attendingTrips } = await supabase
    .from("trip_members")
    .select("trip_id, trips(id, river_name, date, creator_id, profiles(display_name))")
    .eq("user_id", userId)
    .limit(5);

  const displayName = profile?.display_name || user?.firstName || "Paddler";
  const skillLevel = profile?.skill_level || "III";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Header */}
      <div
        className="border-b px-4 py-10 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(78,205,196,0.08) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Hey, {displayName}!
          </h1>
          <p className="mt-2 text-base" style={{ color: "#8B8FA8" }}>
            Class {skillLevel} paddler
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/trips/new"
            className="flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-white/5"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(78,205,196,0.15)" }}
            >
              <Calendar className="h-5 w-5" style={{ color: "#4ECDC4" }} />
            </div>
            <div>
              <p className="font-medium text-white">Post a Trip</p>
              <p className="text-sm" style={{ color: "#8B8FA8" }}>
                Find crew for your next run
              </p>
            </div>
          </Link>

          <Link
            href="/friends"
            className="flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-white/5"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(78,205,196,0.15)" }}
            >
              <Users className="h-5 w-5" style={{ color: "#4ECDC4" }} />
            </div>
            <div>
              <p className="font-medium text-white">Friends</p>
              <p className="text-sm" style={{ color: "#8B8FA8" }}>
                Connect with paddlers
              </p>
            </div>
          </Link>

          <Link
            href="/rivers"
            className="flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-white/5"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(78,205,196,0.15)" }}
            >
              <Droplets className="h-5 w-5" style={{ color: "#4ECDC4" }} />
            </div>
            <div>
              <p className="font-medium text-white">Check Flows</p>
              <p className="text-sm" style={{ color: "#8B8FA8" }}>
                See current conditions
              </p>
            </div>
          </Link>
        </div>

        {/* My Trips */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">Your Trips</h2>
          {myTrips && myTrips.length > 0 ? (
            <div className="space-y-3">
              {myTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  <div>
                    <p className="font-medium text-white">{trip.river_name}</p>
                    <p className="text-sm" style={{ color: "#8B8FA8" }}>
                      {new Date(trip.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        trip.spots_remaining > 0
                          ? "rgba(78,205,196,0.15)"
                          : "rgba(255,107,107,0.15)",
                      color: trip.spots_remaining > 0 ? "#4ECDC4" : "#FF6B6B",
                    }}
                  >
                    {trip.spots_remaining} spots left
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center" style={{ color: "#8B8FA8" }}>
              No upcoming trips.{" "}
              <Link href="/trips/new" style={{ color: "#4ECDC4" }}>
                Post one!
              </Link>
            </p>
          )}
        </div>

        {/* Attending */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            Trips You&apos;re Joining
          </h2>
          {attendingTrips && attendingTrips.length > 0 ? (
            <div className="space-y-3">
              {attendingTrips.map((member: any) => (
                <Link
                  key={member.trip_id}
                  href={`/trips/${member.trip_id}`}
                  className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  <div>
                    <p className="font-medium text-white">
                      {member.trips?.river_name}
                    </p>
                    <p className="text-sm" style={{ color: "#8B8FA8" }}>
                      {new Date(member.trips?.date).toLocaleDateString()} •{" "}
                      {member.trips?.profiles?.display_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center" style={{ color: "#8B8FA8" }}>
              Not joining any trips yet.{" "}
              <Link href="/trips" style={{ color: "#4ECDC4" }}>
                Find one!
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
