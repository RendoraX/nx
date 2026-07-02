import assert from "node:assert/strict";
import test from "node:test";
import { calculateDiscount, validateCoupon } from "./coupons.service";

test("validateCoupon rejects expired coupons", async () => {
  await assert.rejects(() =>
    validateCoupon(
      {
        code: "OLD",
        expiresAt: new Date(Date.now() - 1000),
        usageLimit: 3,
        percentage: 10,
        fixedAmount: null,
      },
      500,
    ),
  );
});

test("calculateDiscount uses percentage when available", () => {
  const result = calculateDiscount({ percentage: 10 }, 500);
  assert.equal(result.discount, 50);
  assert.equal(result.total, 450);
});
