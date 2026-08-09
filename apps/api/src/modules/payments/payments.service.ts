import crypto from "node:crypto";
import { createAuditLog } from "../../lib/audit";
import { deleteOrderCascade, updateStatus } from "../orders/orders.repository";
import { releaseStock, reserveStock } from "../inventory/inventory.repository";
import { createPayment, findPaymentByOrderId, findPaymentByTransactionId, updatePayment } from "./payments.repository";
import { createPaymentOrderSchema, verifyPaymentSchema, webhookSchema } from "./payments.schema";
import type { CreatePaymentOrderDTO, PaymentWebhookDTO, VerifyPaymentDTO } from "./payments.types";
import razorpay, { RAZORPAY_KEY_SECRET } from "../../utils/payment/rzr";
import { getOrderById } from "../orders/orders.service";

// Official Razorpay Signature Verification: HMAC SHA256 of (razorpay_order_id + "|" + razorpay_payment_id)
export function verifyPaymentSignature(payload: VerifyPaymentDTO) {
  if (!RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay key secret is not configured");
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature, "utf8");
  const incomingBuffer = Buffer.from(payload.razorpay_signature, "utf8");

  return (
    generatedBuffer.length === incomingBuffer.length &&
    crypto.timingSafeEqual(generatedBuffer, incomingBuffer)
  );
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

  const payment =
    (await findPaymentByTransactionId(data.razorpay_order_id)) ||
    (await findPaymentByOrderId(data.razorpay_order_id));

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "SUCCESS") {
    return payment;
  }

  const updatedPayment = await updatePayment(payment.id, {
    status: "SUCCESS",
    transactionId: data.razorpay_payment_id,
  });

  await updateStatus(payment.orderId, "CONFIRMED");

  /// Hold the stock for that user
  const order = await getOrderById(userId, payment.orderId);
  await Promise.all(
    order.items.map((item) =>
      reserveStock(item.variant.inventory?.id as string, item.quantity)
    )
  );

  await createAuditLog(userId, "payment_verified", "Payment", payment.id, {
    orderId: payment.orderId,
    paymentId: data.razorpay_payment_id,
  });

  return { payment: updatedPayment, orderStatus: "CONFIRMED" };
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
      const order = await getOrderById(userId , orderId);

  order.items.map(async (i) => {
      await releaseStock(i.variant.inventory?.id as string , i.quantity);
  })
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