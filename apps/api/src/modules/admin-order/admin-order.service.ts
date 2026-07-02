import { createAuditLog } from "../../lib/audit";
import { findById, updateStatus } from "../orders/orders.repository";

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
  if (fromStatus === "DELIVERED" && toStatus !== "DELIVERED") return false;
  if (fromStatus === "CANCELLED") return false;
  const fromIndex = ORDER_STATUS_FLOW.indexOf(fromStatus as (typeof ORDER_STATUS_FLOW)[number]);
  const toIndex = ORDER_STATUS_FLOW.indexOf(toStatus as (typeof ORDER_STATUS_FLOW)[number]);
  if (fromIndex === -1 || toIndex === -1) return false;
  return toIndex === fromIndex + 1 || (fromStatus === "PENDING" && toStatus === "CANCELLED");
}

export async function updateAdminOrderStatus(userId: string, orderId: string, status: string) {
  const order = await findById(orderId);
  if (!order) throw new Error("Order not found");
  if (!canTransitionStatus(order.status, status)) throw new Error("Invalid order status transition");
  const updated = await updateStatus(orderId, status);
  await createAuditLog(userId, "admin_updated_order_status", "Order", order.id, { from: order.status, to: status });
  return updated;
}
