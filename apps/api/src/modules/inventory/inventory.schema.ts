import z from 'zod'

export const inventoryUpdateSchema = z.object({
    inventoryId : z.string(),
    direction : z.enum(['add' , 'remove']),
    quantity : z.number(),
    notes : z.string().optional(),
    reason : z.string().optional(),
    type : z.string().optional(),
});

export const bulkInventoryUpdateSchema = z.object({
    inventoryIds: z.array(z.string().min(1)).min(1, 'At least one inventory item is required'),
    quantity: z.number().int(),
    notes: z.string().optional(),
    reason: z.string().min(1, 'A reason is required for batch updates'),
    type: z.string().optional(),
});