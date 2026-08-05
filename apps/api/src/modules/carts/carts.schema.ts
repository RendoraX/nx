import { z } from "zod";

export const addToCartSchema = z.object({
  variantId: z.string().min(1, "Product id is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const removeItemSchema = z.object({
  itemId: z.string().min(1, "Cart item id is required"),
});
