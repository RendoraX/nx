import crypto from "node:crypto";
import { createAuditLog } from "../../lib/audit";
import { updateStatus } from "../orders/orders.repository";
import { releaseStock, reserveStock } from "../inventory/inventory.repository";
import { createPayment, findPaymentByOrderId, updatePaymentStatus } from "./payments.repository";
import { createPaymentOrderSchema, verifyPaymentSchema, webhookSchema } from "./payments.schema";
import type { CreatePaymentOrderDTO, PaymentWebhookDTO, VerifyPaymentDTO } from "./payments.types";

const PAYMENT_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "dev-secret";

export function createPaymentSignature(payload: { paymentId: string; orderId: string; amount: string }) {
  return crypto.createHmac("sha256", PAYMENT_SECRET).update(`${payload.paymentId}:${payload.orderId}:${payload.amount}`).digest("hex");
}

export function verifyPaymentSignature(payload: VerifyPaymentDTO) {
  const expected = createPaymentSignature({ paymentId: payload.paymentId, orderId: payload.orderId, amount: payload.amount });
  return expected === payload.signature;
}

//completed
export async function createPaymentOrder(userId: string, payload: CreatePaymentOrderDTO) {
  const data = createPaymentOrderSchema.parse(payload);
  const existing = await findPaymentByOrderId(data.orderId);
  if (existing) {
    return existing;
  }

  const payment = await createPayment({
    orderId: data.orderId,
    provider: data.provider ?? "RAZORPAY",
    amount: data.amount,
    status: "PENDING",
    transactionId: `pay_${Date.now()}`,
  });

  await createAuditLog(userId, "payment_order_created", "Payment", payment.id, { orderId: data.orderId });
  return payment;
}


//completed
export async function verifyPayment(userId: string, payload: VerifyPaymentDTO) {
  const data = verifyPaymentSchema.parse(payload);
  if (!verifyPaymentSignature(data)) {
    throw new Error("Invalid payment signature");
  }

  const payment = await findPaymentByOrderId(data.orderId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "SUCCESS") {
    return payment;
  }

  await updatePaymentStatus(data.orderId, "SUCCESS", data.paymentId);
  await updateStatus(data.orderId, "CONFIRMED");
  await reserveStock("placeholder-product-id", 1);

  await createAuditLog(userId, "payment_verified", "Payment", payment.id, { orderId: data.orderId, paymentId: data.paymentId });
  return { payment: await findPaymentByOrderId(data.orderId), orderStatus: "CONFIRMED" };
}

//completed
export async function failPayment(userId: string, orderId: string) {
  const payment = await findPaymentByOrderId(orderId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  await updatePaymentStatus(orderId, "FAILED");
  await updateStatus(orderId, "PENDING");
  await releaseStock("placeholder-product-id", 1);

  await createAuditLog(userId, "payment_failed", "Payment", payment.id, { orderId });
  return { payment: await findPaymentByOrderId(orderId) };
}


//completed
export async function handlePaymentWebhook(payload: PaymentWebhookDTO) {
  const data = webhookSchema.parse(payload);
  if (!data.orderId || !data.paymentId) {
    throw new Error("Payment webhook payload is incomplete");
  }

  const payment = await findPaymentByOrderId(data.orderId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (data.status === "SUCCESS" || data.status === "succeeded") {
    await updatePaymentStatus(data.orderId, "SUCCESS", data.paymentId);
    await updateStatus(data.orderId, "CONFIRMED");
    await reserveStock("placeholder-product-id", 1);
  }

  if (data.status === "FAILED" || data.status === "failed") {
    await updatePaymentStatus(data.orderId, "FAILED");
    await updateStatus(data.orderId, "PENDING");
    await releaseStock("placeholder-product-id", 1);
  }

  return { ok: true, status: data.status ?? "received" };
}
