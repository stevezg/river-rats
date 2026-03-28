"use client";

import { useState, useMemo } from "react";
import type { River } from "@/lib/rivers";
import type { DifficultyClass } from "@/lib/rivers";
import RiverCard from "./RiverCard";

const ALL_DIFFICULTIES: DifficultyClass[] = [
  "I-II",
  "III",
  "III-IV",
  "IV",
  "IV-V",
  "V",
  "V+",
];

interface Props {
  rivers: River[];
}

export default function RiversFilter({ rivers }: Props) {
  const allStates = useMemo(
    () => Array.from(new Set(rivers.map((r) => r.state))).sort(),
    [rivers]
  );

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return rivers.filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.region.toLowerCase().includes(search.toLowerCase());
      const matchState = stateFilter === "all" || r.state === stateFilter;
      const matchDifficulty =
        difficultyFilter === "all" || r.difficulty === difficultyFilter;
      return matchSearch && matchState && matchDifficulty;
    });
  }, [rivers, search, stateFilter, difficultyFilter]);

  return (
    <>
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
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5c6070"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search rivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#5c6070] outline-none transition-colors focus:border-[#4ECDC4]"
              style={{
                backgroundColor: "#1C1F26",
                borderColor: "rgba(255,255,255,0.10)",
              }}
              aria-label="Search rivers"
            />
          </div>

          {/* State filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-xl border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#4ECDC4] cursor-pointer"
            style={{
              backgroundColor: "#1C1F26",
              borderColor: "rgba(255,255,255,0.10)",
            }}
            aria-label="Filter by state"
          >
            <option value="all">All States</option>
            {allStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Difficulty filter */}
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
            <option value="all">All Classes</option>
            {ALL_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                Class {d}
              </option>
            ))}
          </select>

          {/* Result count */}
          <span className="text-sm ml-auto" style={{ color: "#5c6070" }}>
            {filtered.length} river{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-white">No rivers found</p>
            <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((river) => (
              <RiverCard key={river.id} river={river} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
