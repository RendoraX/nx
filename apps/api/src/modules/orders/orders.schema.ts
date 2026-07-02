import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
});
