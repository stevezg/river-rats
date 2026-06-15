import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { fetchFlowData } from "./usgs";

const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;

afterEach(() => {
  globalThis.fetch = originalFetch;
  console.error = originalConsoleError;
});

test("fetchFlowData parses discharge, temperature, and trend by gauge", async () => {
  globalThis.fetch = async (url) => {
    assert.match(String(url), /sites=unit-gauge-rising/);
    assert.match(String(url), /parameterCd=00060,00010/);

    return new Response(
      JSON.stringify({
        value: {
          timeSeries: [
            {
              sourceInfo: { siteCode: [{ value: "unit-gauge-rising" }] },
              variable: { variableCode: [{ value: "00060" }] },
              values: [
                {
                  value: [
                    { value: "499", dateTime: "2026-05-27T10:00:00.000Z" },
                    { value: "525", dateTime: "2026-05-27T10:15:00.000Z" },
                  ],
                },
              ],
            },
            {
              sourceInfo: { siteCode: [{ value: "unit-gauge-rising" }] },
              variable: { variableCode: [{ value: "00010" }] },
              values: [
                {
                  value: [{ value: "8.4", dateTime: "2026-05-27T10:15:00.000Z" }],
                },
              ],
            },
          ],
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  };

  const flows = await fetchFlowData(["unit-gauge-rising"]);

  assert.deepEqual(flows.get("unit-gauge-rising"), {
    cfs: 525,
    timestamp: "2026-05-27T10:15:00.000Z",
    trend: "rising",
    tempC: 8.4,
  });
});

test("fetchFlowData degrades to an empty map when the USGS request fails", async () => {
  console.error = () => {};
  globalThis.fetch = async () => new Response("Unavailable", { status: 503, statusText: "Service Unavailable" });

  const flows = await fetchFlowData(["unit-gauge-failure"]);

  assert.equal(flows.size, 0);
});

test("fetchFlowData reads American Whitewater-backed non-USGS gauges", async () => {
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /trpc-api\.americanwhitewater\.org\/reach\/reachDetail/);
    assert.match(String(url), /unit-reach/);
    assert.equal((init?.headers as Record<string, string>)["X-Requested-With"], "XMLHttpRequest");

    return new Response(
      JSON.stringify({
        result: {
          data: {
            json: {
              detail: {
                correlations: [
                  {
                    isPrimary: true,
                    status: {
                      latestReading: {
                        value: "754",
                        dateTime: "2026-06-15T19:45:00.000Z",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  };

  const flows = await fetchFlowData([
    {
      gaugeId: "unit-cdec-gauge",
      gaugeSource: "CDEC",
      awReachId: "unit-reach",
    },
  ]);

  assert.deepEqual(flows.get("unit-cdec-gauge"), {
    cfs: 754,
    timestamp: "2026-06-15T19:45:00.000Z",
    trend: "stable",
  });
});
