import Link from "next/link";
import type { Trip } from "@/lib/mock-data";
import DifficultyBadge from "./DifficultyBadge";
import FlowBadge from "./FlowBadge";
import { formatDate } from "@/lib/utils";

interface Props {
  trip: Trip;
}

export default function TripCard({ trip }: Props) {
  const spotsPercent = (trip.spotsRemaining / trip.totalSpots) * 100;
  const isAlmostFull = trip.spotsRemaining <= 1;

  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-xl"
      style={{
        backgroundColor: "#1C1F26",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: "#4ECDC4", opacity: 0.6 }} />

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/trips/${trip.id}`}
              className="text-base font-semibold text-white hover:text-[#4ECDC4] transition-colors leading-snug"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {trip.riverName}
            </Link>
            <p className="mt-0.5 text-sm" style={{ color: "#8B8FA8" }}>
              {trip.region}, {trip.state}
            </p>
          </div>
          <DifficultyBadge difficulty={trip.difficulty} size="sm" />
        </div>

        {/* Date + time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5" style={{ color: "#8B8FA8" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-white font-medium">{formatDate(trip.date)}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: "#8B8FA8" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{trip.time}</span>
          </div>
        </div>

        {/* Flow */}
        <FlowBadge cfs={trip.currentCfs} />

        {/* Notes preview */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: "#8B8FA8" }}
        >
          {trip.notes}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t pt-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-[#0F1117]"
                style={{ backgroundColor: "#4ECDC4" }}
              >
                {trip.creatorName.charAt(0)}
              </div>
              <span className="text-sm text-white font-medium">{trip.creatorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: "#8B8FA8" }}>Min skill:</span>
              <DifficultyBadge difficulty={trip.minSkill} size="sm" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`text-sm font-semibold ${isAlmostFull ? "text-[#FF6B6B]" : "text-white"}`}
            >
              {trip.spotsRemaining === 0
                ? "Full"
                : `${trip.spotsRemaining} spot${trip.spotsRemaining !== 1 ? "s" : ""} left`}
            </span>
            <div
              className="h-1 w-16 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${100 - spotsPercent}%`,
                  backgroundColor: isAlmostFull ? "#FF6B6B" : "#4ECDC4",
                }}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/trips/${trip.id}`}
          className="w-full rounded-xl py-2.5 text-center text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: trip.spotsRemaining === 0 ? "#5c6070" : "#4ECDC4" }}
        >
          {trip.spotsRemaining === 0 ? "Trip Full" : "Request to Join"}
        </Link>
      </div>
    </div>
  );
}
