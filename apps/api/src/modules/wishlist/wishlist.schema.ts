import * as z from 'zod'

export const addWishlistVariantSchema = () => z.object({
    productId : z.string().nonempty("Product id not provided !"),
    variantId : z.string().nonempty("Variant id not provided !"),
    identifier : z.string().nonempty("Action is prohibited !"),
});

export const getWishlistSchema = () => z.object({
    userId : z.string().nonempty("Action is prohibited !"),
});

export const deleteItemSchema  = () => z.object({
    id : z.string().nonempty("Wishlist id is not provided !"),
    productId : z.string().nonempty("Product id is not provided !"),
    variantId : z.string().nonempty("Variant id is not provided !")
});