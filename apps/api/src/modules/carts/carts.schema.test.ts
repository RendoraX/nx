import assert from "node:assert/strict";
import test from "node:test";
import { addToCartSchema, removeItemSchema, updateQuantitySchema } from "./carts.schema";

test("addToCartSchema rejects non-positive quantity", () => {
  assert.throws(() => addToCartSchema.parse({ productId: "prod_1", quantity: 0 }));
});

test("updateQuantitySchema accepts a valid quantity", () => {
  const payload = updateQuantitySchema.parse({ quantity: 3 });
  assert.equal(payload.quantity, 3);
});

test("removeItemSchema requires an identifier", () => {
  assert.throws(() => removeItemSchema.parse({}));
});
