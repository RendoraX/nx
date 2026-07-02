import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionStatus } from "./orders.service";

test("canTransitionStatus rejects moving back to pending", () => {
  assert.equal(canTransitionStatus("DELIVERED", "PENDING"), false);
});

test("canTransitionStatus allows normal progression", () => {
  assert.equal(canTransitionStatus("PENDING", "CONFIRMED"), true);
});
