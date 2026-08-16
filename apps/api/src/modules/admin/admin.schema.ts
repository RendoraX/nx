import z from 'zod'

export const createCustomKitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  baseBoxPrice: z.number().positive("Price must be greater than 0"),
  isActive: z.boolean().default(true),
  curatedBy: z.string().default("Shri Vishwanath Team"),
  defaultItems: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      variantId: z.string().optional(),
      quantity: z.number().int().positive("Quantity must be at least 1")
    })
  )
});

export type CreateKitInput = z.infer<typeof createCustomKitSchema>;

export const updateCustomKitSchema = z.object({
    name : z.string().optional(),
    slug : z.string().optional(),
    description : z.string().optional(),
    baseBoxPrice : z.number().min(1 , "Please provide valid price for product !!").optional(),
    isActive : z.boolean().default(true).optional(),
    curatedBy : z.string().optional().default("Shri Vishwanath Team"),
    defaultItems : z.array(z.object({
                productId : z.string().optional(),
        quantity : z.number().optional()
    })).optional()
})