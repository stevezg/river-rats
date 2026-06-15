import assert from "node:assert/strict";
import test from "node:test";
import { riversData } from "./rivers-data";

test("river slugs and American Whitewater reach IDs are unique", () => {
  const slugs = new Set(riversData.map((river) => river.slug));
  const awReachIds = new Set(riversData.map((river) => river.awReachId));

  assert.equal(slugs.size, riversData.length);
  assert.equal(awReachIds.size, riversData.length);
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
    assert.ok(river.gaugeId.length > 0, `${river.slug} should include a gauge ID`);
    assert.ok(river.gaugeSource.length > 0, `${river.slug} should include a gauge source`);
    assert.ok(river.awReachId, `${river.slug} should include an American Whitewater reach ID`);
    assert.ok(river.hazards.length > 0, `${river.slug} should include hazards`);
  }
});
