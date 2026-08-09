import { prisma } from "../../../../../packages/database/src/client";
import { clearCart, findCartByUser } from "../carts/carts.repository";
import { findInventory, releaseStock, reserveStock } from "../inventory/inventory.repository";
import { findAddressByIdAndUser } from "../users/users.repository";
import { createOrder, cancelOrder, findById, findByUser, updateStatus } from "./orders.repository";
import { createOrderSchema, updateOrderStatusSchema } from "./orders.schema";
import type { CreateOrderDTO, UpdateOrderStatusDTO } from "./orders.types";

const ORDER_STATUS_FLOW = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

const SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_FEE = 40;

export function canTransitionStatus(fromStatus: string, toStatus: string) {
  if (fromStatus === "DELIVERED" && toStatus !== "DELIVERED") {
    return false;
  }

  if (fromStatus === "CANCELLED") {
    return false;
  }

  const fromIndex = ORDER_STATUS_FLOW.indexOf(fromStatus as (typeof ORDER_STATUS_FLOW)[number]);
  const toIndex = ORDER_STATUS_FLOW.indexOf(toStatus as (typeof ORDER_STATUS_FLOW)[number]);

  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }

  return toIndex === fromIndex + 1 || (fromStatus === "PENDING" && toStatus === "CANCELLED");
}

export async function createOrderForUser(userId: string, payload: CreateOrderDTO) {
  // 1. Validate Payload
  const data = createOrderSchema.parse(payload);

  // 2. Fetch User Cart
  const cart = await findCartByUser(userId);
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cannot process checkout: Cart is empty or does not exist.");
  }

  // 3. Verify Address Ownership
  const address = await findAddressByIdAndUser(data.addressId, userId);
  if (!address) {
    throw new Error("Invalid address: Selected address does not exist or belong to user.");
  }

  // 4. Calculate Financial Totals & Structure Order Items
  let subtotal = 0;
  const orderItemsData = cart.items.map((cartItem) => {
    const itemPrice = Number(cartItem.variant?.price ?? 0);
    const itemQuantity = cartItem.quantity;

    subtotal += itemPrice * itemQuantity;

    return {
      productId: cartItem.variant?.product?.id || "",
      variantId: cartItem.variantId,
      quantity: itemQuantity,
      price: itemPrice,
    };
  });

  const shippingAmount = subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingAmount;

  // 5. Execute Atomic Transaction
  return await prisma.$transaction(async (tx) => {
    // Reserve Stock
    for (const item of cart.items) {
      const inventoryId = item.variant?.inventory?.id;
      if (!inventoryId) {
        throw new Error(`Inventory reference missing for item: ${item.id}`);
      }

      const inventory = await findInventory( inventoryId);
      if (!inventory || inventory.stock < item.quantity) {
        throw new Error(
          `Insufficient stock available for product "${item.variant?.product?.name  || 'item'}".`
        );
      }

      await reserveStock( inventoryId, item.quantity);
    }

    // Create Order with properly formatted items array
    console.log("================Provider+++++++++++++++++++" , payload.paymentMethod)
    const createdOrder = await createOrder(
      {
        userId,
        addressId: data.addressId,
        subtotal,
        shippingAmount,
        totalAmount,
        items: orderItemsData,
        paymentMethod : payload.paymentMethod as string
      },
      tx
    );

    // Clear Cart Items
    await clearCart(cart.id);

    return createdOrder;
  });
}

export async function getOrdersForUser(userId: string) {
  return findByUser(userId);
}

export async function getOrderById(userId: string, id: string) {
  const order = await findById(id);
  if (!order || order.userId !== userId) {
    throw new Error("Order not found");
  }
  return order;
}

export async function updateOrderStatus(userId: string, id: string, payload: UpdateOrderStatusDTO) {
  const data = updateOrderStatusSchema.parse(payload);
  const order = await findById(id);

  if (!order || order.userId !== userId) {
    throw new Error("Order not found");
  }

  if (!canTransitionStatus(order.status, data.status)) {
    throw new Error("Invalid order status transition");
  }

  return updateStatus(id, data.status);
}

export async function cancelUserOrder(userId: string, id: string) {
  const order = await findById(id);
  if (!order || order.userId !== userId) {
    throw new Error("Order not found");
  }

  if (order.status === "DELIVERED") {
    throw new Error("Delivered orders cannot be cancelled");
  }

  order.items.map(async (i) => {
    await releaseStock(i?.variant?.inventory?.id as string ,i.quantity )
  })
  return cancelOrder(id);
}
