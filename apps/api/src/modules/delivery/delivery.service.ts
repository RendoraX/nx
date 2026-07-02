import { createAuditLog } from "../../lib/audit";
import { updateStatus } from "../orders/orders.repository";
import { assignDelivery, findAssignmentByOrderId, getAssignedDeliveries, updateAssignment } from "./delivery.repository";

const VALID_TRANSITIONS: Record<string, string[]> = {
  accept: ["PENDING", "CONFIRMED", "PACKED"],
  pickup: ["CONFIRMED", "PACKED", "SHIPPED"],
  out_for_delivery: ["SHIPPED"],
  delivered: ["OUT_FOR_DELIVERY"],
};

//completed
export async function listAssignedDeliveries(deliveryBoyId: string) {
  return getAssignedDeliveries(deliveryBoyId);
}

//completed
export async function acceptDeliveryAssignment(userId: string, assignmentId: string) {
  const assignment = await (await import("./delivery.repository")).findAssignmentByOrderId(assignmentId);
  if (!assignment) throw new Error("Assignment not found");
  const order = await (await import("../orders/orders.repository")).findById(assignment.orderId);
  if (!order) throw new Error("Order not found");
  if (!VALID_TRANSITIONS.accept.includes(order.status)) throw new Error("Invalid delivery transition");
  await updateStatus(order.id, "PACKED");
  await createAuditLog(userId, "delivery_accepted", "DeliveryAssignment", assignment.id, { orderId: order.id });
  return { assignment, orderStatus: "PACKED" };
}

//completed
export async function markPickedUp(userId: string, orderId: string) {
  const assignment = await findAssignmentByOrderId(orderId);
  if (!assignment) throw new Error("Assignment not found");
  const order = await (await import("../orders/orders.repository")).findById(orderId);
  if (!order) throw new Error("Order not found");
  if (!VALID_TRANSITIONS.pickup.includes(order.status)) throw new Error("Invalid delivery transition");
  await updateStatus(order.id, "SHIPPED");
  await updateAssignment(assignment.id, { pickedAt: new Date() });
  await createAuditLog(userId, "delivery_picked_up", "DeliveryAssignment", assignment.id, { orderId });
  return { assignment, orderStatus: "SHIPPED" };
}

//completed
export async function markOutForDelivery(userId: string, orderId: string) {
  const assignment = await findAssignmentByOrderId(orderId);
  if (!assignment) throw new Error("Assignment not found");
  const order = await (await import("../orders/orders.repository")).findById(orderId);
  if (!order) throw new Error("Order not found");
  if (!VALID_TRANSITIONS.out_for_delivery.includes(order.status)) throw new Error("Invalid delivery transition");
  await updateStatus(order.id, "OUT_FOR_DELIVERY");
  await createAuditLog(userId, "delivery_out_for_delivery", "DeliveryAssignment", assignment.id, { orderId });
  return { assignment, orderStatus: "OUT_FOR_DELIVERY" };
}

//completed
export async function markDelivered(userId: string, orderId: string) {
  const assignment = await findAssignmentByOrderId(orderId);
  if (!assignment) throw new Error("Assignment not found");
  const order = await (await import("../orders/orders.repository")).findById(orderId);
  if (!order) throw new Error("Order not found");
  if (!VALID_TRANSITIONS.delivered.includes(order.status)) throw new Error("Invalid delivery transition");
  await updateStatus(order.id, "DELIVERED");
  await updateAssignment(assignment.id, { deliveredAt: new Date() });
  await createAuditLog(userId, "delivery_delivered", "DeliveryAssignment", assignment.id, { orderId });
  return { assignment, orderStatus: "DELIVERED" };
}

//completed 
export async function assignDeliveryToOrder(userId: string, orderId: string, deliveryBoyId: string) {
  const assignment = await assignDelivery(orderId, deliveryBoyId);
  await createAuditLog(userId, "delivery_assigned", "DeliveryAssignment", assignment.id, { orderId, deliveryBoyId });
  return assignment;
}
