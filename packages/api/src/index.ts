import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { fetchFlowData, riversData } from "@riverrats/shared";
import type { RiverStatic, FlowTrend } from "@riverrats/shared";

const app = new Hono();

// ── Types ─────────────────────────────────────────────────────────────────────

interface River extends RiverStatic {
  currentCfs: number;
  timestamp: string;
  trend: FlowTrend;
  runnable: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRunnable(cfs: number, optimalMin: number, optimalMax: number): boolean {
  return cfs >= optimalMin && cfs <= optimalMax * 1.5;
}

async function getAllRivers(): Promise<River[]> {
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

// ── Routes ────────────────────────────────────────────────────────────────────

/** GET /api/rivers — all rivers with live flow data */
app.get("/api/rivers", async (c) => {
  const rivers = await getAllRivers();
  return c.json(rivers);
});

/** GET /api/rivers/:slug — single river with live flow data */
app.get("/api/rivers/:slug", async (c) => {
  const { slug } = c.req.param();
  const staticRiver = riversData.find((r) => r.slug === slug);
  if (!staticRiver) {
    return c.json({ error: "River not found" }, 404);
  }

  const flowMap = await fetchFlowData([staticRiver.gaugeId]);
  const flow = flowMap.get(staticRiver.gaugeId);
  const currentCfs = flow?.cfs ?? 0;

  const river: River = {
    ...staticRiver,
    currentCfs,
    timestamp: flow?.timestamp ?? "",
    trend: flow?.trend ?? "stable",
    runnable: flow ? isRunnable(currentCfs, staticRiver.optimalMin, staticRiver.optimalMax) : false,
  };

  return c.json(river);
});

/** GET /api/flow/:gaugeId — raw USGS flow for a single gauge */
app.get("/api/flow/:gaugeId", async (c) => {
  const { gaugeId } = c.req.param();
  const flowMap = await fetchFlowData([gaugeId]);
  const flow = flowMap.get(gaugeId);

  if (!flow) {
    return c.json({ error: "No flow data available for this gauge" }, 404);
  }

  return c.json({ gaugeId, ...flow });
});

// ── Server ────────────────────────────────────────────────────────────────────

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, () => {
  console.log(`[api] River Rats API running on http://localhost:${port}`);
});

export default app;
