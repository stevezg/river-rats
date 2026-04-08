// USGS Statistics Service — daily statistics (percentiles) across period of record.
// https://waterservices.usgs.gov/nwis/stat/?format=json&sites={GAUGE}&parameterCd=00060&statReportType=daily

export interface FlowPercentile {
  percentile: number; // estimated 0–100
  label: string;      // "historic low" | "below normal" | "normal" | "above normal" | "record high"
  p25: number;
  p75: number;
  median: number;
}

function getLabel(p: number): string {
  if (p <= 10) return "historic low";
  if (p <= 25) return "below normal";
  if (p <= 75) return "normal";
  if (p <= 90) return "above normal";
  return "record high";
}

function getLabelColor(label: string): string {
  switch (label) {
    case "historic low": return "#FF6B6B";
    case "below normal": return "#FFA94D";
    case "normal": return "#52B788";
    case "above normal": return "#4ECDC4";
    case "record high": return "#FF6B6B";
    default: return "#8B8FA8";
  }
}

export { getLabelColor };

export async function fetchFlowPercentile(
  gaugeId: string,
  currentCfs: number
): Promise<FlowPercentile | null> {
  if (currentCfs <= 0) return null;

  const url = `https://waterservices.usgs.gov/nwis/stat/?format=json&sites=${gaugeId}&parameterCd=00060&statReportType=daily`;

  try {
    const res = await fetch(url, {
      // @ts-ignore
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const timeSeries = data?.value?.timeSeries ?? [];

    // The stats API response has a different structure from the IV/DV APIs.
    // Each timeSeries entry in the stats response represents one statistic type.
    // The values are indexed by day-of-year. We need today's month/day.
    const today = new Date();
    const monthStr = String(today.getMonth() + 1).padStart(2, "0");
    const dayStr = String(today.getDate()).padStart(2, "0");

    // Find the mean/median/p25/p75 for today across timeSeries
    // The USGS stats API returns: timeSeries[0] is the only series,
    // values[0].value[] contains objects with dateTime = "YYYY-MM-DD" for each day of year
    // and qualifiers[] containing the stat type. Actually the structure varies —
    // the most reliable approach is to look for records matching today's month+day.

    let p25 = 0, p75 = 0, median = 0;
    let found = false;

    for (const series of timeSeries) {
      const values = series?.values?.[0]?.value ?? [];
      for (const v of values) {
        // dateTime in stats response is like "1851-01-15" or "0000-01-15"
        const dt: string = v.dateTime ?? "";
        const [, mm, dd] = dt.split("-");
        if (mm !== monthStr || dd !== dayStr) continue;

        const qualifiers: string[] = v.qualifiers ?? [];
        const val = parseFloat(v.value);
        if (isNaN(val)) continue;

        if (qualifiers.includes("P25")) p25 = val;
        else if (qualifiers.includes("P75")) p75 = val;
        else if (qualifiers.includes("P50") || qualifiers.includes("median")) median = val;
        found = true;
      }
    }

    if (!found || (p25 === 0 && p75 === 0)) return null;

    // Estimate percentile by interpolation
    let percentile: number;
    if (currentCfs <= p25) {
      percentile = Math.round((currentCfs / p25) * 25);
    } else if (currentCfs <= median && median > p25) {
      percentile = 25 + Math.round(((currentCfs - p25) / (median - p25)) * 25);
    } else if (currentCfs <= p75 && p75 > median) {
      percentile = 50 + Math.round(((currentCfs - median) / (p75 - median)) * 25);
    } else if (p75 > 0) {
      percentile = Math.min(99, 75 + Math.round(((currentCfs - p75) / p75) * 25));
    } else {
      percentile = 50;
    }

    const label = getLabel(percentile);
    return { percentile, label, p25, p75, median };
  } catch {
    return null;
  }
}
