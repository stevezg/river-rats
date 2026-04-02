// USGS Daily Values API — returns mean daily discharge for a date range.
// https://waterservices.usgs.gov/nwis/dv/?format=json&sites={GAUGE}&parameterCd=00060&startDT=YYYY-MM-DD&endDT=YYYY-MM-DD

export interface DailyFlowPoint {
  date: string; // "YYYY-MM-DD"
  cfs: number;
}

export async function fetchDailyFlow(
  gaugeId: string,
  days = 7
): Promise<DailyFlowPoint[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const url = `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=${gaugeId}&parameterCd=00060&startDT=${fmt(startDate)}&endDT=${fmt(endDate)}`;

  try {
    const res = await fetch(url, {
      // @ts-ignore
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const values: Array<{ value: string; dateTime: string }> =
      data?.value?.timeSeries?.[0]?.values?.[0]?.value ?? [];

    return values
      .filter((v) => v.value !== "-999999" && !isNaN(parseFloat(v.value)))
      .map((v) => ({
        date: v.dateTime.slice(0, 10),
        cfs: parseFloat(v.value),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}
