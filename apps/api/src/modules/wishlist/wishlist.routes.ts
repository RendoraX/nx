import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { addToWishListController, deleteItemFromWishlistController, getWishlistController } from "./wishlist.controller";

const router = Router();


router.post(
    '/wishlist/ad',
    authMiddleware,
    addToWishListController
);

router.get(
    '/wishlist/',
    authMiddleware,
    getWishlistController
);


router.delete(
    '/wishlist/:id',
    authMiddleware,
    deleteItemFromWishlistController
)


export default router;