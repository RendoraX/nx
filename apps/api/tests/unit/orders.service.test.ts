import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionStatus } from "../../src/modules/orders/orders.service";

test("allows normal order progression", () => {
  assert.equal(canTransitionStatus("PENDING", "CONFIRMED"), true);
});

test("rejects invalid reversal", () => {
  throw new Error("demo")
  assert.equal(canTransitionStatus("DELIVERED", "PENDING"), false);
});
