import assert from "node:assert/strict";
import test from "node:test";
import { riversData } from "./rivers-data";

test("river slugs and gauge IDs are unique", () => {
  const slugs = new Set(riversData.map((river) => river.slug));
  const gaugeIds = new Set(riversData.map((river) => river.gaugeId));

  assert.equal(slugs.size, riversData.length);
  assert.equal(gaugeIds.size, riversData.length);
});

test("Colorado beta has seeded runs", () => {
  const coloradoRuns = riversData.filter((river) => river.state === "CO");

  assert.ok(coloradoRuns.length >= 12);
  assert.ok(coloradoRuns.some((river) => river.slug === "clear-creek"));
  assert.ok(coloradoRuns.some((river) => river.slug === "arkansas-royal-gorge"));
  assert.ok(coloradoRuns.some((river) => river.slug === "cache-la-poudre"));
});

test("all runs have valid runnable ranges", () => {
  for (const river of riversData) {
    assert.ok(river.optimalMin > 0, `${river.slug} optimalMin must be positive`);
    assert.ok(river.optimalMax > river.optimalMin, `${river.slug} optimalMax must exceed optimalMin`);
    assert.ok(river.hazards.length > 0, `${river.slug} should include hazards`);
  }
});
