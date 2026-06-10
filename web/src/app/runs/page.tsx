import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getRivers } from "@/lib/rivers";
import DifficultyBadge from "@/components/DifficultyBadge";
import FlowBadge from "@/components/FlowBadge";

export const metadata: Metadata = {
  title: "Runs | RiverRat Colorado Beta",
  description: "Colorado river runs with live flow status.",
};

export const revalidate = 60;

export default async function RunsPage() {
  const rivers = await getRivers();
  const coloradoRivers = rivers
    .filter((river) => river.state === "CO")
    .sort((a, b) => Number(b.runnable) - Number(a.runnable) || b.currentCfs - a.currentCfs);
  const runnableCount = coloradoRivers.filter((river) => river.runnable).length;

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="border-b border-white/[0.06] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4ECDC4]">Colorado beta</p>
            <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Runs</h1>
            <p className="mt-3 text-base text-[#8B8FA8]">
              {runnableCount} runnable now. Pick the flow, then call the crew.
            </p>
          </div>
          <Link
            href="/trips/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#4ECDC4] px-5 text-sm font-semibold text-[#0F1117]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create trip
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coloradoRivers.map((river) => (
            <Link
              key={river.slug}
              href={`/rivers/${river.slug}`}
              className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-5 transition-colors hover:border-[#4ECDC4]/35"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className={
                    river.runnable
                      ? "rounded-full bg-[#4ECDC4]/10 px-2.5 py-1 text-xs font-semibold text-[#4ECDC4]"
                      : "rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-[#8B8FA8]"
                  }
                >
                  {river.runnable ? "In" : "Watch"}
                </span>
                <FlowBadge cfs={river.currentCfs} compact />
              </div>

              <h2 className="text-xl font-bold text-white">{river.name.split(" — ")[0]}</h2>
              <p className="mt-1 text-sm text-[#8B8FA8]">{river.region}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-[#0F1117] p-3">
                  <p className="text-xs uppercase text-[#5c6070]">Difficulty</p>
                  <div className="mt-2">
                    <DifficultyBadge difficulty={river.difficulty} size="sm" inline />
                  </div>
                </div>
                <div className="rounded-md bg-[#0F1117] p-3">
                  <p className="text-xs uppercase text-[#5c6070]">Optimal</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {river.optimalMin.toLocaleString()}-{river.optimalMax.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
