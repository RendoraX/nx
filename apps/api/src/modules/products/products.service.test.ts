import assert from "node:assert/strict";
import test from "node:test";
import { createProductSchema } from "./products.schema";

test("createProductSchema rejects negative prices", () => {
  assert.throws(() => {
    createProductSchema.parse({
      name: "Test Product",
      description: "A sample product",
      price: -100,
      categoryId: "cat_123",
      sku: "SKU-1",
    });
  });
});

test("createProductSchema accepts a valid payload", () => {
  const payload = createProductSchema.parse({
    name: "Test Product",
    description: "A sample product",
    price: 199,
    categoryId: "cat_123",
    sku: "SKU-1",
  });

  assert.equal(payload.name, "Test Product");
  assert.equal(payload.price, 199);
});
