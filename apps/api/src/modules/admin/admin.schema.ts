import z from 'zod'

export const createCustomKitSchema = z.object({
    name : z.string().nonempty(),
    slug : z.string().nonoptional(),
    description : z.string().nonempty(),
    baseBoxPrice : z.number().min(1 , "Please provide valid price for product !!"),
    isActive : z.boolean().default(true),
    curatedBy : z.string().nonempty().default("Shri Vishwanath Team"),
    defaultItems : z.array(z.object({
                productId : z.string().nonempty(),
        quantity : z.number().min(1 , "Please provide valid quantity for product !!")
    }))
})

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