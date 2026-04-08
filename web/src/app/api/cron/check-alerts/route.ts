import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// Call this with: Authorization: Bearer {CRON_SECRET}
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase env vars" }, { status: 500 });
  }

  const supabase = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);

  // Fetch enabled alerts
  const { data: alerts, error: alertsError } = await supabase
    .from("flow_alerts")
    .select("id, user_id, river_slug, gauge_id, min_cfs, max_cfs, last_notified_at")
    .eq("enabled", true);

  if (alertsError || !alerts || alerts.length === 0) {
    return NextResponse.json({ checked: 0 });
  }

  // Batch USGS fetch — all unique gauge IDs
  const uniqueGauges = [...new Set(alerts.map((a) => a.gauge_id))];
  const usgsUrl = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${uniqueGauges.join(",")}&parameterCd=00060&siteStatus=active`;

  const cfsMap = new Map<string, number>();
  try {
    const res = await fetch(usgsUrl, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    for (const series of data?.value?.timeSeries ?? []) {
      const gaugeId = series.sourceInfo?.siteCode?.[0]?.value;
      const values = series.values?.[0]?.value ?? [];
      if (!gaugeId || values.length === 0) continue;
      const cfs = parseFloat(values[values.length - 1].value);
      if (!isNaN(cfs)) cfsMap.set(gaugeId, cfs);
    }
  } catch {
    return NextResponse.json({ error: "USGS fetch failed" }, { status: 502 });
  }

  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  let triggered = 0;

  for (const alert of alerts) {
    const cfs = cfsMap.get(alert.gauge_id);
    if (cfs === undefined) continue;

    // Check if within the alert range
    const inRange = cfs >= alert.min_cfs && cfs <= alert.max_cfs;
    if (!inRange) continue;

    // Check cooldown (6 hours)
    if (alert.last_notified_at) {
      const lastNotified = new Date(alert.last_notified_at).getTime();
      if (Date.now() - lastNotified < SIX_HOURS_MS) continue;
    }

    // Find the river name
    const riverName = alert.river_slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

    // Create in-app notification
    await supabase.from("notifications").insert({
      user_id: alert.user_id,
      type: "flow_alert",
      title: `${riverName} is running`,
      body: `Current flow is ${cfs.toLocaleString()} CFS — within your alert range of ${alert.min_cfs.toLocaleString()}–${alert.max_cfs.toLocaleString()} CFS.`,
      river_slug: alert.river_slug,
    });

    // Update last_notified_at
    await supabase
      .from("flow_alerts")
      .update({ last_notified_at: new Date().toISOString() })
      .eq("id", alert.id);

    triggered++;
  }

  return NextResponse.json({ checked: alerts.length, triggered });
}
