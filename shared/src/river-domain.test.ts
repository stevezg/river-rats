import assert from "node:assert/strict";
import test from "node:test";
import { DefaultRiverFlowPolicy, RiverCatalog } from "./river-domain";
import type { RiverStatic } from "./rivers-data";

const testRivers: RiverStatic[] = [
  {
    id: "unit-1",
    slug: "unit-creek",
    name: "Unit Creek",
    region: "Test Range",
    state: "CO",
    difficulty: "III",
    optimalMin: 100,
    optimalMax: 300,
    description: "Test run",
    hazards: ["Tests"],
    gaugeId: "unit-gauge-1",
  },
  {
    id: "unit-2",
    slug: "sample-fork",
    name: "Sample Fork",
    region: "Test Range",
    state: "CO",
    difficulty: "IV",
    optimalMin: 200,
    optimalMax: 500,
    description: "Another test run",
    hazards: ["Assertions"],
    gaugeId: "unit-gauge-2",
  },
];

test("RiverCatalog indexes rivers by slug and gauge id", () => {
  const catalog = new RiverCatalog(testRivers);

  assert.equal(catalog.findBySlug("unit-creek")?.gaugeId, "unit-gauge-1");
  assert.equal(catalog.findByGaugeId("unit-gauge-2")?.slug, "sample-fork");
  assert.deepEqual(catalog.getGaugeIds(), ["unit-gauge-1", "unit-gauge-2"]);
});

test("RiverCatalog merges flow data into static river definitions", () => {
  const catalog = new RiverCatalog(testRivers);
  const rivers = catalog.withFlows(
    new Map([
      [
        "unit-gauge-1",
        {
          cfs: 225,
          timestamp: "2026-06-01T12:00:00.000Z",
          trend: "rising",
          tempC: 7.2,
        },
      ],
    ])
  );

  assert.equal(rivers[0].currentCfs, 225);
  assert.equal(rivers[0].runnable, true);
  assert.equal(rivers[0].trend, "rising");
  assert.equal(rivers[0].tempC, 7.2);

  assert.equal(rivers[1].currentCfs, 0);
  assert.equal(rivers[1].runnable, false);
  assert.equal(rivers[1].trend, "stable");
});

test("DefaultRiverFlowPolicy preserves River Rats flow thresholds", () => {
  const policy = new DefaultRiverFlowPolicy();
  const river = { optimalMin: 100, optimalMax: 300 };

  assert.equal(policy.isRunnable(99, river), false);
  assert.equal(policy.isRunnable(100, river), true);
  assert.equal(policy.isRunnable(450, river), true);
  assert.equal(policy.isRunnable(451, river), false);

  assert.deepEqual(policy.getStatus(50, river), { label: "Too Low", color: "#5c6070" });
  assert.deepEqual(policy.getStatus(200, river), { label: "Optimal", color: "#52B788" });
  assert.deepEqual(policy.getStatus(301, river), { label: "High Water", color: "#FF6B6B" });
});

