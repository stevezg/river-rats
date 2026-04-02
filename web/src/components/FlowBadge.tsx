import { formatCfs, getTrendIcon, getTrendColor, getFlowStatus } from "@/lib/utils";
import type { FlowTrend } from "@riverrats/shared";

interface Props {
  cfs: number;
  optimalMin?: number;
  optimalMax?: number;
  trend?: FlowTrend;
  showStatus?: boolean;
  compact?: boolean;
}

export default function FlowBadge({
  cfs,
  optimalMin,
  optimalMax,
  trend,
  showStatus = false,
  compact = false,
}: Props) {
  const trendColor = trend ? getTrendColor(trend) : "#8B8FA8";
  const trendIcon = trend ? getTrendIcon(trend) : "";

  const status =
    showStatus && optimalMin !== undefined && optimalMax !== undefined
      ? getFlowStatus(cfs, optimalMin, optimalMax)
      : null;

  if (compact) {
    const dotColor = status?.color ?? "#4ECDC4";
    return (
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-xs font-medium" style={{ color: dotColor }}>
          {cfs.toLocaleString()} CFS
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium"
        style={{ backgroundColor: "rgba(78, 205, 196, 0.10)", color: "#4ECDC4" }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <path
            d="M6 1C6 1 2 4.5 2 7a4 4 0 008 0c0-2.5-4-6-4-6z"
            fill="currentColor"
          />
        </svg>
        {formatCfs(cfs)}
        {trend && (
          <span style={{ color: trendColor }} className="font-bold text-xs">
            {trendIcon}
          </span>
        )}
      </div>
      {status && (
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            color: status.color,
            backgroundColor: `${status.color}18`,
            border: `1px solid ${status.color}30`,
          }}
        >
          {status.label}
        </span>
      )}
    </div>
  );
}
