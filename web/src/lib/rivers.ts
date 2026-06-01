import { fetchFlowData } from "./usgs";
import { RiverCatalog, riversData } from "@riverrats/shared";
import type { DifficultyClass, FlowTrend, River } from "@riverrats/shared";

export type { DifficultyClass, FlowTrend, River };

const riverCatalog = new RiverCatalog(riversData);

/**
 * Returns all rivers with live USGS flow data merged in.
 * Falls back to cfs=0 / trend="stable" / runnable=false when a gauge fetch fails.
 */
export async function getRivers(): Promise<River[]> {
  const gaugeIds = riverCatalog.getGaugeIds();
  const flowMap = await fetchFlowData(gaugeIds);
  return riverCatalog.withFlows(flowMap);
}

/**
 * Returns a single river with live flow data, or null if the slug is unknown.
 */
export async function getRiverBySlug(slug: string): Promise<River | null> {
  const staticRiver = riverCatalog.findBySlug(slug);
  if (!staticRiver) return null;

  const flowMap = await fetchFlowData([staticRiver.gaugeId]);
  const flow = flowMap.get(staticRiver.gaugeId);
  return riverCatalog.withFlow(staticRiver, flow);
}
