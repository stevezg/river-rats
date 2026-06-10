import assert from "node:assert/strict";
import test from "node:test";
import {
  formatCfs,
  formatDate,
  getDifficultyBg,
  getDifficultyColor,
  getFlowStatus,
  getTrendColor,
  getTrendIcon,
} from "./utils";

test("formats river flow values", () => {
  assert.equal(formatCfs(1250), "1,250 CFS");
});

test("formats trip dates at midday to avoid timezone drift", () => {
  assert.equal(formatDate("2026-05-27"), "Wed, May 27, 2026");
});

test("maps difficulty classes to UI colors", () => {
  assert.equal(getDifficultyColor("I-II"), "#52B788");
  assert.equal(getDifficultyColor("IV-V"), "#FF8C42");
  assert.equal(getDifficultyColor("V+"), "#C62828");
  assert.equal(getDifficultyBg("III"), "rgba(255, 169, 77, 0.15)");
});

test("maps flow trends to symbols and colors", () => {
  assert.equal(getTrendIcon("rising"), "↑");
  assert.equal(getTrendIcon("falling"), "↓");
  assert.equal(getTrendIcon("stable"), "→");
  assert.equal(getTrendColor("rising"), "#52B788");
});

test("classifies flow status against runnable ranges", () => {
  assert.deepEqual(getFlowStatus(299, 300, 800), { label: "Too Low", color: "#5c6070" });
  assert.deepEqual(getFlowStatus(850, 300, 800), { label: "High Water", color: "#FF6B6B" });
  assert.deepEqual(getFlowStatus(350, 300, 800), { label: "Low Optimal", color: "#4ECDC4" });
  assert.deepEqual(getFlowStatus(550, 300, 800), { label: "Optimal", color: "#52B788" });
  assert.deepEqual(getFlowStatus(750, 300, 800), { label: "High Optimal", color: "#FFA94D" });
});
