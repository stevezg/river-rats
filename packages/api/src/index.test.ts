import assert from "node:assert/strict";
import test from "node:test";
import app from "./index";

test("GET /api/rivers/:slug returns 404 for an unknown run", async () => {
  const response = await app.request("/api/rivers/not-a-real-run");
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, { error: "River not found" });
});
