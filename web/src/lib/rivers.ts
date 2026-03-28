import { riversData } from "./rivers-data";
import { fetchFlowData } from "./usgs";
import type { RiverStatic, DifficultyClass, FlowTrend } from "@riverrats/shared";

export type { DifficultyClass, FlowTrend };

export interface River extends RiverStatic {
  currentCfs: number;
  timestamp: string;
  trend: FlowTrend;
  runnable: boolean;
}

function isRunnable(cfs: number, optimalMin: number, optimalMax: number): boolean {
  // Runnable if within 0–150% of the optimal max (too far above is also dangerous)
  return cfs >= optimalMin && cfs <= optimalMax * 1.5;
}

/**
 * Returns all rivers with live USGS flow data merged in.
 * Falls back to cfs=0 / trend="stable" / runnable=false when a gauge fetch fails.
 */
export async function getRivers(): Promise<River[]> {
  const gaugeIds = riversData.map((r) => r.gaugeId);
  const flowMap = await fetchFlowData(gaugeIds);

  return riversData.map((r) => {
    const flow = flowMap.get(r.gaugeId);
    const currentCfs = flow?.cfs ?? 0;
    return {
      ...r,
      currentCfs,
      timestamp: flow?.timestamp ?? "",
      trend: flow?.trend ?? "stable",
      runnable: flow ? isRunnable(currentCfs, r.optimalMin, r.optimalMax) : false,
    };
  });
}

/**
 * Returns a single river with live flow data, or null if the slug is unknown.
 */
export async function getRiverBySlug(slug: string): Promise<River | null> {
  const staticRiver = riversData.find((r) => r.slug === slug);
  if (!staticRiver) return null;

  const flowMap = await fetchFlowData([staticRiver.gaugeId]);
  const flow = flowMap.get(staticRiver.gaugeId);
  const currentCfs = flow?.cfs ?? 0;

  return {
    ...staticRiver,
    currentCfs,
    timestamp: flow?.timestamp ?? "",
    trend: flow?.trend ?? "stable",
    runnable: flow ? isRunnable(currentCfs, staticRiver.optimalMin, staticRiver.optimalMax) : false,
  };
}
