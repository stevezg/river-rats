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

export interface FlowGauge {
  gaugeId: string;
  gaugeSource?: string;
  awReachId?: string;
}

// Simple in-memory cache with TTL — prevents hammering the USGS API
const flowCache = new Map<string, { data: FlowData; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function gaugeCacheKey(gauge: FlowGauge): string {
  return `${gauge.gaugeSource ?? "USGS"}:${gauge.gaugeId}`;
}

function getCached(gauge: FlowGauge): FlowData | null {
  const entry = flowCache.get(gaugeCacheKey(gauge));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    flowCache.delete(gaugeCacheKey(gauge));
    return null;
  }
  return entry.data;
}

function setCached(gauge: FlowGauge, data: FlowData): void {
  flowCache.set(gaugeCacheKey(gauge), { data, expiresAt: Date.now() + CACHE_TTL_MS });
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

interface AmericanWhitewaterReachResponse {
  result?: {
    data?: {
      json?: {
        detail?: {
          correlations?: Array<{
            isPrimary?: boolean;
            gaugeInfo?: {
              gaugeSource?: string;
              gaugeSourceIdentifier?: string;
            };
            status?: {
              latestReading?: {
                value?: string | number;
                dateTime?: string;
              };
            };
          }>;
        };
        primaryGaugeStatus?: {
          latestReading?: {
            value?: string | number;
            dateTime?: string;
          };
        };
      };
    };
  };
}

function normalizeGauge(gauge: string | FlowGauge): FlowGauge {
  return typeof gauge === "string" ? { gaugeId: gauge, gaugeSource: "USGS" } : gauge;
}

function parseAmericanWhitewaterReading(
  body: AmericanWhitewaterReachResponse,
  gauge: FlowGauge
): FlowData | null {
  const reach = body.result?.data?.json;
  const correlation =
    reach?.detail?.correlations?.find((entry) => entry.isPrimary) ??
    reach?.detail?.correlations?.[0];
  const latest = correlation?.status?.latestReading ?? reach?.primaryGaugeStatus?.latestReading;

  const cfs = Number(latest?.value);
  if (!Number.isFinite(cfs) || cfs < 0 || !latest?.dateTime) return null;

  return {
    cfs,
    timestamp: latest.dateTime,
    trend: "stable",
  };
}

async function fetchAmericanWhitewaterGauge(gauge: FlowGauge): Promise<FlowData | null> {
  if (!gauge.awReachId) return null;

  const input = encodeURIComponent(JSON.stringify({ json: { reachID: gauge.awReachId } }));
  const url = `https://trpc-api.americanwhitewater.org/reach/reachDetail?input=${input}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      // @ts-ignore
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`American Whitewater API responded with ${response.status} ${response.statusText}`);
    }

    const body: AmericanWhitewaterReachResponse = await response.json();
    const flowData = parseAmericanWhitewaterReading(body, gauge);
    if (flowData) setCached(gauge, flowData);
    return flowData;
  } catch (error) {
    console.error("[AW] Failed to fetch flow data:", error);
    return null;
  }
}

/**
 * Fetch live discharge (CFS) data for one or more USGS gauges.
 * Results are cached in-memory for 5 minutes per gauge.
 *
 * @param gaugeIds - Array of USGS site IDs (e.g. ["07091200", "06719505"])
 * @returns Map from gauge ID to FlowData. Gauges that fail or have no data are omitted.
 */
export async function fetchFlowData(
  gauges: Array<string | FlowGauge>
): Promise<Map<string, FlowData>> {
  const result = new Map<string, FlowData>();
  const uncachedUSGSGauges: FlowGauge[] = [];
  const uncachedAWGauges: FlowGauge[] = [];

  for (const rawGauge of gauges) {
    const gauge = normalizeGauge(rawGauge);
    const cached = getCached(gauge);
    if (cached) {
      result.set(gauge.gaugeId, cached);
    } else if ((gauge.gaugeSource ?? "USGS") === "USGS") {
      uncachedUSGSGauges.push(gauge);
    } else {
      uncachedAWGauges.push(gauge);
    }
  }

  await Promise.all(
    uncachedAWGauges.map(async (gauge) => {
      const flowData = await fetchAmericanWhitewaterGauge(gauge);
      if (flowData) result.set(gauge.gaugeId, flowData);
    })
  );

  if (uncachedUSGSGauges.length === 0) return result;

  const sitesParam = Array.from(new Set(uncachedUSGSGauges.map((gauge) => gauge.gaugeId))).join(",");
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
      setCached({ gaugeId, gaugeSource: "USGS" }, flowData);
      result.set(gaugeId, flowData);
    }
  } catch (error) {
    console.error("[USGS] Failed to fetch flow data:", error);
    // Degrade gracefully — caller decides what to do with missing gauges
  }

  return result;
}
