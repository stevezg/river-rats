// USGS Instantaneous Values (IV) API
// Docs: https://waterservices.usgs.gov/docs/instantaneous-values/instantaneous-values-details/
// API endpoint pattern:
//   https://waterservices.usgs.gov/nwis/iv/?format=json&sites=GAUGE_ID&parameterCd=00060&siteStatus=active
// parameterCd 00060 = discharge (CFS)

export type FlowTrend = "rising" | "falling" | "stable";

export interface FlowData {
  cfs: number;
  timestamp: string;
  trend: FlowTrend;
  tempC?: number;
}

// Simple in-memory cache with TTL — prevents hammering the USGS API
const flowCache = new Map<string, { data: FlowData; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(gaugeId: string): FlowData | null {
  const entry = flowCache.get(gaugeId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    flowCache.delete(gaugeId);
    return null;
  }
  return entry.data;
}

function setCached(gaugeId: string, data: FlowData): void {
  flowCache.set(gaugeId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function determineTrend(
  values: Array<{ value: string; dateTime: string }>
): FlowTrend {
  if (values.length < 2) return "stable";
  const latest = parseFloat(values[values.length - 1].value);
  const previous = parseFloat(values[values.length - 2].value);
  if (isNaN(latest) || isNaN(previous)) return "stable";
  const diff = latest - previous;
  // Treat changes smaller than 1 CFS as stable noise
  if (Math.abs(diff) < 1) return "stable";
  return diff > 0 ? "rising" : "falling";
}

interface USGSTimeSeries {
  sourceInfo: {
    siteCode: Array<{ value: string }>;
  };
  variable?: {
    variableCode?: Array<{ value: string }>;
  };
  values: Array<{
    value: Array<{
      value: string;
      dateTime: string;
    }>;
  }>;
}

interface USGSResponse {
  value: {
    timeSeries: USGSTimeSeries[];
  };
}

/**
 * Fetch live discharge (CFS) data for one or more USGS gauges.
 * Results are cached in-memory for 5 minutes per gauge.
 *
 * @param gaugeIds - Array of USGS site IDs (e.g. ["07091200", "06719505"])
 * @returns Map from gauge ID to FlowData. Gauges that fail or have no data are omitted.
 */
export async function fetchFlowData(
  gaugeIds: string[]
): Promise<Map<string, FlowData>> {
  const result = new Map<string, FlowData>();
  const uncachedIds: string[] = [];

  for (const id of gaugeIds) {
    const cached = getCached(id);
    if (cached) {
      result.set(id, cached);
    } else {
      uncachedIds.push(id);
    }
  }

  if (uncachedIds.length === 0) return result;

  const sitesParam = uncachedIds.join(",");
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${sitesParam}&parameterCd=00060,00010&siteStatus=active`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      // Next.js extended fetch: revalidate every 5 minutes at the CDN layer too
      // Non-Next environments ignore this property safely
      // @ts-ignore
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `USGS API responded with ${response.status} ${response.statusText}`
      );
    }

    const data: USGSResponse = await response.json();
    const timeSeries: USGSTimeSeries[] = data?.value?.timeSeries ?? [];

    // Collect data per gauge across both parameters
    const gaugeCollector = new Map<string, {
      cfs?: number;
      cfsTimestamp?: string;
      cfsValues?: Array<{ value: string; dateTime: string }>;
      tempC?: number;
    }>();

    for (const series of timeSeries) {
      const gaugeId = series.sourceInfo?.siteCode?.[0]?.value;
      if (!gaugeId) continue;

      const paramCode = series.variable?.variableCode?.[0]?.value;
      const values = series.values?.[0]?.value ?? [];
      if (values.length === 0) continue;

      const latest = values[values.length - 1];
      const parsed = parseFloat(latest.value);
      if (isNaN(parsed) || parsed < 0) continue;

      if (!gaugeCollector.has(gaugeId)) gaugeCollector.set(gaugeId, {});
      const entry = gaugeCollector.get(gaugeId)!;

      if (paramCode === "00060") {
        entry.cfs = parsed;
        entry.cfsTimestamp = latest.dateTime;
        entry.cfsValues = values;
      } else if (paramCode === "00010") {
        entry.tempC = parsed;
      }
    }

    for (const [gaugeId, entry] of gaugeCollector) {
      if (entry.cfs === undefined || !entry.cfsTimestamp || !entry.cfsValues) continue;
      const flowData: FlowData = {
        cfs: entry.cfs,
        timestamp: entry.cfsTimestamp,
        trend: determineTrend(entry.cfsValues),
        ...(entry.tempC !== undefined ? { tempC: entry.tempC } : {}),
      };
      setCached(gaugeId, flowData);
      result.set(gaugeId, flowData);
    }
  } catch (error) {
    console.error("[USGS] Failed to fetch flow data:", error);
    // Degrade gracefully — caller decides what to do with missing gauges
  }

  return result;
}
