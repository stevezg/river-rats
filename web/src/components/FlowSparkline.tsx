import type { DailyFlowPoint } from "@/lib/usgs-daily";

interface Props {
  points: DailyFlowPoint[];
  optimalMin: number;
  optimalMax: number;
}

export default function FlowSparkline({ points, optimalMin, optimalMax }: Props) {
  if (points.length < 2) {
    return (
      <div className="flex h-12 items-center justify-center rounded-lg text-xs" style={{ color: "#5c6070", backgroundColor: "rgba(255,255,255,0.03)" }}>
        No history data
      </div>
    );
  }

  const W = 280;
  const H = 48;
  const PAD = 4;

  const cfsList = points.map((p) => p.cfs);
  const minVal = Math.min(...cfsList) * 0.9;
  const maxVal = Math.max(...cfsList) * 1.1;

  const toX = (i: number) => PAD + (i / (points.length - 1)) * (W - PAD * 2);
  const toY = (cfs: number) => H - PAD - ((cfs - minVal) / (maxVal - minVal)) * (H - PAD * 2);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(p.cfs).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${toX(points.length - 1).toFixed(1)},${H} L${PAD},${H} Z`;

  // Optimal band clipped to chart bounds
  const optMinY = Math.min(H, Math.max(PAD, toY(optimalMin)));
  const optMaxY = Math.min(H, Math.max(PAD, toY(optimalMax)));

  const lastPt = points[points.length - 1];
  const lastX = toX(points.length - 1);
  const lastY = toY(lastPt.cfs);

  // Label first and last date
  const firstLabel = points[0].date.slice(5).replace("-", "/");
  const lastLabel = lastPt.date.slice(5).replace("-", "/");

  return (
    <div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-label="7-day flow history"
        role="img"
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Optimal range band */}
        <rect
          x={PAD}
          y={optMaxY}
          width={W - PAD * 2}
          height={Math.abs(optMinY - optMaxY)}
          fill="#52B788"
          fillOpacity="0.10"
        />

        {/* Area fill */}
        <path d={areaPath} fill="url(#sparkGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#4ECDC4" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Last point dot */}
        <circle cx={lastX} cy={lastY} r="3" fill="#4ECDC4" />
      </svg>

      <div className="flex justify-between text-[10px] mt-1" style={{ color: "#5c6070" }}>
        <span>{firstLabel}</span>
        <span className="font-medium" style={{ color: "#4ECDC4" }}>
          {lastPt.cfs.toLocaleString()} CFS
        </span>
        <span>{lastLabel}</span>
      </div>
    </div>
  );
}
