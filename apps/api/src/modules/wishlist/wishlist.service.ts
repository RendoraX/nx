import { addVariantToWishlist, deleteItemlst, getWishlist } from "./wishlist.repository";
import { addWishlistVariantSchema, deleteItemSchema, getWishlistSchema } from "./wishlist.schema";
import { addWishlistVariant, getList } from "./wishlist.types";

export const addToWish = async (payload : addWishlistVariant) => {
    try {
        const validData = addWishlistVariantSchema().parse(payload);
        return await addVariantToWishlist(validData)
    } catch (error) {
        throw new Error((error as any).message  || "Error while adding the product.")
    }
};



export const getWish = async (payload : getList) => {
    try {
        const validData = getWishlistSchema().parse(payload);
        return await getWishlist(validData);
    } catch (error) {
        throw new Error((error as any).message || "Wishlist fetch error.")
    }
};


export const deleteItemFromList = async (id : string , user : any , productId : string , variantId : string) => {
    try {
        const wishlist = await getWishlist({userId : (user.id as string)});
        if(!wishlist) throw new Error("Wishlist for this user is not available.");

        console.log(id  , "==" , wishlist.id)
        if(id != wishlist.id)throw new Error("Action denied.");

        const validData = deleteItemSchema().parse({id , productId , variantId});
        return await deleteItemlst({id , productId , variantId});
    } catch (error) {
        throw new Error((error as any).message || "Error while removing the item from wishlist")
    }
}