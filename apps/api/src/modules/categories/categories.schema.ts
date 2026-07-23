import z, { slugify, string } from "zod";

export const createCatSchema = z.object({
    name : z.string().nonoptional(),
    slug : z.string().nonempty(),

    parentId : z.string().optional().nullable()
});

export const updateCatSchema = z.object({
    id : z.string(),
    name : z.string().optional(),
    slug : z.string().optional(),
    parentId : z.string().optional()
});


export const deleteCatSchema = z.object({
    id : z.string().nonempty()
})