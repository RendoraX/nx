# Custom kit order flow

Custom-kit checkout is a separate order path from normal cart checkout. It submits
the selected kit and configured kit lines to `POST /api/custkits/order`; it does
not read from or clear the user's cart.

## Checkout request

The browser sends the selected template ID, account-owned delivery address,
payment method, and each chosen product variant with its requested quantity:

```json
{
  "kitId": "template-id",
  "addressId": "address-id",
  "paymentMethod": "ONLINE",
  "items": [
    {
      "productId": "product-id",
      "variantId": "variant-id",
      "quantity": 3
    }
  ]
}
```

Browser-supplied prices, names, and totals are deliberately not accepted as
authoritative order data. The API validates the payload, confirms that the
address belongs to the signed-in user, confirms that the selected kit is active
and the variants belong to its template items, and reads product prices and
availability from the database. Quantities must be positive whole numbers, and
duplicate product/variant lines are rejected.

## Order creation and pricing

Order validation, stock reservation, order items, payment record, and pending
status history are created in one database transaction. Any validation, stock,
or persistence failure rolls the transaction back. Kit lines are persisted as
regular order-item records using the selected variant IDs; the order itself is
marked with `type: KIT` and snapshots `kitName`, `kitSlug`, and `kitBasePrice`.
This keeps the kit order independent of both the cart and later template-name
edits.

The server uses the saved kit pricing rules:

- Manual-price kits charge the configured base kit price.
- Automatically priced kits charge the base kit price plus selected variant
  prices, excluding the first selected unit included in the kit price.
- Shipping remains included, matching the existing kit checkout UI.

The API response includes the created order. Online payment is initialized with
the server-calculated `order.totalAmount`, not the total from local storage.
Kit stock is reserved when the order is created. Payment verification does not
reserve it again; cancellation and payment failure release it.

## Account order history

The account orders endpoint now returns order type, kit snapshot fields, and
the variant/product relations for each order item. The order tab labels kit
orders and displays their saved kit name and selected product/variant lines.
Normal product orders continue to display their individual product lines.

## Schema and deployment

`OrderType` (`PRODUCT` / `KIT`) and its migration already existed in the schema;
the kit-order endpoint now writes `KIT` explicitly. The new migration adds the
kit metadata snapshots to `Order` and persists the existing admin
`isManualPrice` setting on `RitualTemplate`.

For deployment, apply Prisma migrations to the target database, then regenerate
the Prisma client when building the application:

```sh
pnpm exec prisma migrate deploy --schema=packages/database/prisma/schema.prisma
pnpm --filter @repo/database generate
```

Custom-kit checkout should then be verified with both COD and online payment,
including a modified quantity, insufficient stock, and a kit item not belonging
to the selected template.
