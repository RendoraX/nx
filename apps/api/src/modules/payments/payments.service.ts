import crypto from "node:crypto";
import { createAuditLog } from "../../lib/audit";
import { deleteOrderCascade, updateStatus } from "../orders/orders.repository";
import { releaseStock, reserveStock } from "../inventory/inventory.repository";
import { createPayment, findPaymentByOrderId, updatePayment } from "./payments.repository";
import { createPaymentOrderSchema, verifyPaymentSchema, webhookSchema } from "./payments.schema";
import type { CreatePaymentOrderDTO, PaymentWebhookDTO, VerifyPaymentDTO } from "./payments.types";
import razorpay from "../../utils/payment/rzr";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "dev-secret";

// Official Razorpay Signature Verification: HMAC SHA256 of (razorpay_order_id + "|" + razorpay_payment_id)
export function verifyPaymentSignature(payload: VerifyPaymentDTO) {
  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${payload.orderId}|${payload.paymentId}`)
    .digest("hex");
  return generatedSignature === payload.signature;
}

// completed
export async function createPaymentOrder(userId: string, payload: CreatePaymentOrderDTO) {
  const data = createPaymentOrderSchema.parse(payload);
  const existing = await findPaymentByOrderId(data.orderId);

  // Return existing ONLY if it already has a valid Razorpay Order ID
  if (existing && existing.transactionId) {
    return {
      ...existing,
      razorpayOrderId: existing.transactionId,
    };
  }

  // 1. Create actual Order via Razorpay SDK (Amount in paise)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round((data.amount as number) * 100), 
    currency: 'INR',
    receipt: data.orderId,
  });

  // 2. If record exists without transactionId, update it; otherwise create new
  let payment;
  console.log("==================verify payment===================\n" , payload)
  if (existing) {
    payment = await updatePayment(existing.id, {
      transactionId: razorpayOrder.id,
      status: "PENDING",
    });
  } else {
    payment = await createPayment({
      orderId: data.orderId,
      provider: data.provider ?? "RAZORPAY",
      amount: data.amount as number,
      status: "PENDING",
      transactionId: razorpayOrder.id,
    });
  }

  await createAuditLog(userId, "payment_order_created", "Payment", payment.id, { 
    orderId: data.orderId, 
    razorpayOrderId: razorpayOrder.id 
  });

  return {
    ...payment,
    razorpayOrderId: razorpayOrder.id,
  };
}

// completed
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

  await updatePayment(payment.id, { status: "SUCCESS", transactionId: data.paymentId });
  await updateStatus(data.orderId, "CONFIRMED");
  await reserveStock("placeholder-product-id", 1);

  await createAuditLog(userId, "payment_verified", "Payment", payment.id, { orderId: data.orderId, paymentId: data.paymentId });
  return { payment: await findPaymentByOrderId(data.orderId), orderStatus: "CONFIRMED" };
}

// completed
export async function failPayment(userId: string, orderId: string) {
  const payment = await findPaymentByOrderId(orderId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  await updatePayment(payment.id, { status: "FAILED" });
  await updateStatus(orderId, "CANCELLED");

  if (payment.provider === "RAZORPAY") {
    await deleteOrderCascade(orderId);
  } else {
    await releaseStock("placeholder-product-id", 1);
  }

  await createAuditLog(userId, "payment_failed", "Payment", payment.id, { orderId });
  return { payment: await findPaymentByOrderId(orderId) };
}

// completed
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
    await updatePayment(payment.id, { status: "SUCCESS", transactionId: data.paymentId });
    await updateStatus(data.orderId, "CONFIRMED");
    await reserveStock("placeholder-product-id", 1);
  }

  if (data.status === "FAILED" || data.status === "failed") {
    await updatePayment(payment.id, { status: "FAILED" });
    await updateStatus(data.orderId, "CANCELLED");

    if (payment.provider === "RAZORPAY") {
      await deleteOrderCascade(data.orderId);
    } else {
      await releaseStock("placeholder-product-id", 1);
    }
  }

  return { ok: true, status: data.status ?? "received" };
}