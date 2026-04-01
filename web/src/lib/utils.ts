import type { DifficultyClass, FlowTrend } from "@riverrats/shared";

export function getDifficultyColor(difficulty: DifficultyClass): string {
  switch (difficulty) {
    case "I-II":
      return "#52B788";
    case "III":
      return "#FFA94D";
    case "III-IV":
      return "#FFA94D";
    case "IV":
      return "#FF8C42";
    case "IV-V":
      return "#FF8C42";
    case "V":
      return "#FF6B6B";
    case "V+":
      return "#C62828";
    default:
      return "#8B8FA8";
  }
}

export function getDifficultyBg(difficulty: DifficultyClass): string {
  switch (difficulty) {
    case "I-II":
      return "rgba(82, 183, 136, 0.15)";
    case "III":
      return "rgba(255, 169, 77, 0.15)";
    case "III-IV":
      return "rgba(255, 169, 77, 0.15)";
    case "IV":
      return "rgba(255, 140, 66, 0.15)";
    case "IV-V":
      return "rgba(255, 140, 66, 0.15)";
    case "V":
      return "rgba(255, 107, 107, 0.15)";
    case "V+":
      return "rgba(198, 40, 40, 0.15)";
    default:
      return "rgba(139, 143, 168, 0.15)";
  }
}

export function getTrendIcon(trend: FlowTrend): string {
  switch (trend) {
    case "rising":
      return "↑";
    case "falling":
      return "↓";
    case "stable":
      return "→";
  }
}

export function getTrendColor(trend: FlowTrend): string {
  switch (trend) {
    case "rising":
      return "#52B788";
    case "falling":
      return "#FFA94D";
    case "stable":
      return "#8B8FA8";
  }
}

export function formatCfs(cfs: number): string {
  return cfs.toLocaleString() + " CFS";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getFlowStatus(
  current: number,
  min: number,
  max: number
): { label: string; color: string } {
  if (current < min) {
    return { label: "Too Low", color: "#5c6070" };
  } else if (current > max) {
    return { label: "High Water", color: "#FF6B6B" };
  } else {
    const pct = (current - min) / (max - min);
    if (pct < 0.33) return { label: "Low Optimal", color: "#4ECDC4" };
    if (pct < 0.66) return { label: "Optimal", color: "#52B788" };
    return { label: "High Optimal", color: "#FFA94D" };
  }
}
