import { releaseStock, reserveStock } from "../inventory/inventory.repository";
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
  const data = createOrderSchema.parse(payload);

  // Placeholder checkout flow: reserve inventory for each cart item in a real implementation.
  await reserveStock("placeholder-product-id", 1);

  const order = await createOrder({
    userId,
    addressId: data.addressId,
    subtotal: 0,
    shippingAmount: 0,
    totalAmount: 0,
    status: "PENDING",
  });

  return order;
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

  await releaseStock("placeholder-product-id", 1);
  return cancelOrder(id);
}
