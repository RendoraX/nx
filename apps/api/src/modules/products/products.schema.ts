import { z } from "zod";

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
});

const variantInputSchema = z.object({
  sizeUnit: z.string().optional(),
  sizeValue: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  price: z.number().min(0).optional(),
  comparePrice: z.number().min(0).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  comparePrice: z.number().min(0).optional(),
  sku: z.string().min(1).optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(variantInputSchema).optional(),
});

export const updateProductSchema = z.object({
  id: z.string().min(1, "Product id is required"),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  comparePrice: z.number().min(0).optional(),
  sku: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(variantInputSchema).optional(),
});

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  slug: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
