import { Request, Response } from "express";
import { addToWish, deleteItemFromList, getWish } from "./wishlist.service";

export const addToWishListController = async (_req : Request , _res : Response) => {
    try {
        const payload = _req.body;
        const item = await addToWish({...payload , identifier : (_req as any).user.id as string})
        return _res.status(200).json({
            message : "Product is added in wishlist.",
            success : true,
            wishlistId : item.id,
            productId : payload.productId,
            variantId : payload.variantId
        })
    } catch (error : any) {
        return _res.status(400).json({
            message : "Product is not added to the wishlist.",
            success : false
        })
    }
};


export const getWishlistController = async (_req : Request , _res : Response) => {
    try {
        const list = await getWish({
            userId : (_req as any).user.id as string
        })
        return _res.status(200).json({
            message  : "List fetched !",
            items : list
        })
    } catch (error) {
        console.log('=====================', (error as any).message)
        return _res.status(400).json({
            message : (error as any).message || "Error while fetching wishlist !",
            success : false
        })
    }
};

export const deleteItemFromWishlistController = async (_req : Request, _res : Response) => {
    try {
        const id : string = _req.params.id as string;
        const {productId , variantId} = await _req.body

        await deleteItemFromList(id , (_req as any).user , productId as string , variantId as string);
        
        return _res.status(200).json({
            message : "Item deleted from wishlist.",
            success : true
        });
    } catch (error) {
        console.log((error as any).message)
        return _res.status(400).json({
            message : (error as any).message || "Error while deleting the item.",
            success : false
        });
    }
}