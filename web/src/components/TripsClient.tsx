"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import TripCard from "@/components/TripCard";
import type { TripSummary, DifficultyClass } from "@/lib/trip-types";
import { createClient } from "@/lib/supabase/client";

const ALL_DIFFICULTIES: DifficultyClass[] = ["III", "III-IV", "IV", "IV-V", "V"];

interface Props {
  trips: TripSummary[];
  isLoggedIn: boolean;
}

export default function TripsClient({ trips, isLoggedIn }: Props) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [liveTrips, setLiveTrips] = useState<TripSummary[]>(trips);
  const [isLive, setIsLive] = useState(false);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const ALL_STATES = useMemo(
    () => Array.from(new Set(liveTrips.map((t) => t.state).filter(Boolean))).sort(),
    [liveTrips]
  );

  useEffect(() => {
    setLiveTrips(trips); // sync when server-side data updates
  }, [trips]);

  useEffect(() => {
    const channel = supabase
      .channel("public:trips:feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "trips", filter: "status=eq.open" },
        (payload) => {
          const newRow = payload.new as Record<string, unknown>;
          const newTrip: TripSummary = {
            id: newRow.id as string,
            riverSlug: newRow.river_slug as string,
            riverName: newRow.river_name as string,
            difficulty: (newRow.min_skill ?? "III") as DifficultyClass,
            date: newRow.date as string,
            time: newRow.time as string,
            meetingPoint: (newRow.meeting_point ?? "") as string,
            notes: (newRow.notes ?? "") as string,
            minSkill: (newRow.min_skill ?? "III") as DifficultyClass,
            creatorName: "New paddler",
            creatorLevel: "III",
            totalSpots: (newRow.total_spots as number) ?? 4,
            spotsRemaining: (newRow.spots_remaining as number) ?? 4,
            currentCfs: 0,
            region: "",
            state: "",
          };
          setLiveTrips((prev) => [newTrip, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "trips" },
        (payload) => {
          const updated = payload.new as Record<string, unknown>;
          setLiveTrips((prev) =>
            prev.map((t) =>
              t.id === updated.id
                ? {
                    ...t,
                    spotsRemaining: (updated.spots_remaining as number) ?? t.spotsRemaining,
                    totalSpots: (updated.total_spots as number) ?? t.totalSpots,
                  }
                : t
            )
          );
        }
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    return liveTrips.filter((t) => {
      const matchDiff = difficultyFilter === "all" || t.difficulty === difficultyFilter;
      const matchRegion = regionFilter === "all" || t.state === regionFilter;
      const matchDate = (() => {
        if (dateFilter === "all") return true;
        const tripDate = new Date(t.date + "T12:00:00");
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (dateFilter === "today") {
          return tripDate.toDateString() === today.toDateString();
        }
        if (dateFilter === "week") {
          const weekOut = new Date(today);
          weekOut.setDate(weekOut.getDate() + 7);
          return tripDate >= today && tripDate <= weekOut;
        }
        if (dateFilter === "weekend") {
          const day = tripDate.getDay();
          const isWeekend = day === 0 || day === 6;
          const weekOut = new Date(today);
          weekOut.setDate(weekOut.getDate() + 14);
          return isWeekend && tripDate >= today && tripDate <= weekOut;
        }
        return true;
      })();
      return matchDiff && matchRegion && matchDate;
    });
  }, [liveTrips, difficultyFilter, regionFilter, dateFilter]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Header */}
      <div
        className="border-b px-4 py-12 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255, 169, 77, 0.08) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-4xl font-bold text-white sm:text-5xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Trip Feed
              </h1>
              {isLive && (
                <span
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
                  style={{ color: "#52B788", borderColor: "rgba(82,183,136,0.30)", backgroundColor: "rgba(82,183,136,0.08)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#52B788] animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <p className="mt-3 text-lg" style={{ color: "#8B8FA8" }}>
              Upcoming runs looking for paddlers. Find your next adventure.
            </p>
          </div>
          {isLoggedIn ? (
            <Link
              href="/trips/new"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              Post a Trip
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:border-white/20"
              style={{ borderColor: "rgba(78,205,196,0.30)", color: "#4ECDC4" }}
            >
              Sign in to Post a Trip
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        className="sticky top-[73px] z-40 border-b px-4 py-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "rgba(15, 17, 23, 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-3">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-xl border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#4ECDC4] cursor-pointer"
            style={{
              backgroundColor: "#1C1F26",
              borderColor: "rgba(255,255,255,0.10)",
            }}
            aria-label="Filter by difficulty"
          >
            <option value="all">All Difficulties</option>
            {ALL_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                Class {d}
              </option>
            ))}
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="rounded-xl border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#4ECDC4] cursor-pointer"
            style={{
              backgroundColor: "#1C1F26",
              borderColor: "rgba(255,255,255,0.10)",
            }}
            aria-label="Filter by state"
          >
            <option value="all">All States</option>
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#4ECDC4] cursor-pointer"
            style={{ backgroundColor: "#1C1F26", borderColor: "rgba(255,255,255,0.10)" }}
            aria-label="Filter by date"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="weekend">This Weekend</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            {(difficultyFilter !== "all" || regionFilter !== "all" || dateFilter !== "all") && (
              <button
                onClick={() => {
                  setDifficultyFilter("all");
                  setRegionFilter("all");
                  setDateFilter("all");
                }}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "#8B8FA8" }}
              >
                Clear filters
              </button>
            )}
            <span className="text-sm" style={{ color: "#5c6070" }}>
              {filtered.length} trip{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {liveTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-white">No trips yet</p>
            <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
              Be the first to post a trip for your crew.
            </p>
            {isLoggedIn ? (
              <Link
                href="/trips/new"
                className="mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90"
                style={{ backgroundColor: "#4ECDC4" }}
              >
                Post a Trip
              </Link>
            ) : (
              <Link
                href="/login"
                className="mt-6 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:text-white"
                style={{ borderColor: "rgba(78,205,196,0.30)", color: "#4ECDC4" }}
              >
                Sign in to Post a Trip
              </Link>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-white">No trips match your filters</p>
            <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
              Try adjusting your filters, or post your own trip.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pb-24 md:pb-0">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
