import Link from "next/link";
import type { River } from "@/lib/rivers";
import DifficultyBadge from "./DifficultyBadge";
import FlowBadge from "./FlowBadge";
import { getFlowStatus } from "@/lib/utils";

interface Props {
  river: River;
}

export default function RiverCard({ river }: Props) {
  const flowStatus = getFlowStatus(river.currentCfs, river.optimalMin, river.optimalMax);

  return (
    <Link
      href={`/rivers/${river.slug}`}
      className="group block rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl"
      style={{
        backgroundColor: "#1C1F26",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3
            className="text-base font-semibold leading-snug text-white group-hover:text-[#4ECDC4] transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {river.name}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: "#8B8FA8" }}>
            {river.region}, {river.state}
          </p>
        </div>
        <DifficultyBadge difficulty={river.difficulty} size="sm" />
      </div>

      {/* Flow */}
      <div className="mb-4">
        <FlowBadge
          cfs={river.currentCfs}
          optimalMin={river.optimalMin}
          optimalMax={river.optimalMax}
          trend={river.trend}
          showStatus
        />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between border-t pt-3"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="text-xs" style={{ color: "#8B8FA8" }}>
          Optimal: {river.optimalMin.toLocaleString()}–{river.optimalMax.toLocaleString()} CFS
        </span>
        <span
          className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            color: flowStatus.color,
            backgroundColor: `${flowStatus.color}18`,
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: flowStatus.color }}
          />
          {river.runnable ? "Runnable" : "Not Runnable"}
        </span>
      </div>
    </Link>
  );
}
