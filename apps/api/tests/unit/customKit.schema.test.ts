import assert from "node:assert/strict";
import test from "node:test";
import { custOrderScheme } from "../../src/modules/customKit/cust.schema";

const validOrder = {
  kitId: "kit-1",
  addressId: "address-1",
  paymentMethod: "COD",
  items: [{ productId: "product-1", variantId: "variant-1", quantity: 4 }],
};

test("accepts custom kit quantities and checkout fields", () => {
  const result = custOrderScheme.safeParse(validOrder);
  assert.equal(result.success, true);
});

test("rejects duplicate variants and invalid quantities", () => {
  assert.equal(
    custOrderScheme.safeParse({
      ...validOrder,
      items: [
        ...validOrder.items,
        { ...validOrder.items[0], quantity: 1 },
      ],
    }).success,
    false,
  );
  assert.equal(
    custOrderScheme.safeParse({
      ...validOrder,
      items: [{ ...validOrder.items[0], quantity: 1.5 }],
    }).success,
    false,
  );
});

test("requires an explicit kit, address, payment method, and kit contents", () => {
  assert.equal(
    custOrderScheme.safeParse({ ...validOrder, addressId: "" }).success,
    false,
  );
  assert.equal(
    custOrderScheme.safeParse({ ...validOrder, items: [] }).success,
    false,
  );
});
