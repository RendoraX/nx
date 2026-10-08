import { z } from "zod";

export const custOrderScheme = z.object({
  kitId: z.string().min(1, "A custom kit is required."),
  addressId: z.string().min(1, "A delivery address is required."),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  items: z.array(
    z.object({
      productId: z.string().min(1, "A product is required."),
      variantId: z.string().min(1, "A product variant is required."),
      quantity: z.number().int().positive("Quantity must be a positive whole number."),
    }),
  ).min(1, "A kit order must contain at least one item."),
}).superRefine((payload, context) => {
  const itemKeys = new Set<string>();
  payload.items.forEach((item, index) => {
    const key = `${item.productId}:${item.variantId}`;
    if (itemKeys.has(key)) {
      context.addIssue({
        code: "custom",
        path: ["items", index],
        message: "Each product variant can only appear once in a kit order.",
      });
    }
    itemKeys.add(key);
  });
});