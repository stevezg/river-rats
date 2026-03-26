"use client";

import { useState, useMemo } from "react";
import { trips } from "@/lib/mock-data";
import type { DifficultyClass } from "@/lib/mock-data";
import TripCard from "@/components/TripCard";
import Link from "next/link";

const ALL_STATES = Array.from(new Set(trips.map((t) => t.state))).sort();
const ALL_DIFFICULTIES: DifficultyClass[] = ["III", "III-IV", "IV", "IV-V", "V"];

export default function TripsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      const matchDiff = difficultyFilter === "all" || t.difficulty === difficultyFilter;
      const matchRegion = regionFilter === "all" || t.state === regionFilter;
      return matchDiff && matchRegion;
    });
  }, [difficultyFilter, regionFilter]);

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
            <h1
              className="text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Trip Feed
            </h1>
            <p className="mt-3 text-lg" style={{ color: "#8B8FA8" }}>
              Upcoming runs looking for paddlers. Find your next adventure.
            </p>
          </div>
          <Link
            href="/#waitlist"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90"
            style={{ backgroundColor: "#4ECDC4" }}
          >
            Post a Trip
          </Link>
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

          {/* Active filters summary */}
          <div className="flex items-center gap-2 ml-auto">
            {(difficultyFilter !== "all" || regionFilter !== "all") && (
              <button
                onClick={() => {
                  setDifficultyFilter("all");
                  setRegionFilter("all");
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
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-white">No trips found</p>
            <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
              Try adjusting your filters, or post your own trip.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
