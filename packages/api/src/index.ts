import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { fetchFlowData, RiverCatalog, riversData } from "@riverrats/shared";

const app = new Hono();
const riverCatalog = new RiverCatalog(riversData);

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAllRivers() {
  const gaugeIds = riverCatalog.getGaugeIds();
  const flowMap = await fetchFlowData(gaugeIds);
  return riverCatalog.withFlows(flowMap);
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
  const staticRiver = riverCatalog.findBySlug(slug);
  if (!staticRiver) {
    return c.json({ error: "River not found" }, 404);
  }

  const flowMap = await fetchFlowData([staticRiver.gaugeId]);
  const flow = flowMap.get(staticRiver.gaugeId);
  const river = riverCatalog.withFlow(staticRiver, flow);

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

if (process.env.NODE_ENV !== "test") {
  serve({ fetch: app.fetch, port }, () => {
    console.log(`[api] River Rats API running on http://localhost:${port}`);
  });
}

export default app;
