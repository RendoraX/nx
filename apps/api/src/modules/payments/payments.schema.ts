import { z } from "zod";

export const createPaymentOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().min(1, "Amount is required"),
  provider: z.enum(["RAZORPAY", "COD"]).optional(),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.string().min(1, "Amount is required"),
  signature: z.string().min(1, "Signature is required"),
});

export const webhookSchema = z.object({
  paymentId: z.string().optional(),
  orderId: z.string().optional(),
  status: z.string().optional(),
  signature: z.string().optional(),
});
