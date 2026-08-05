import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  addToCartEndpoint,
  clearCartEndpoint,
  getCartEndpoint,
  removeCartItemEndpoint,
  updateCartItemEndpoint,
} from "./carts.controller";

const router = Router();

//get all cart items
router.get("/cart", authMiddleware, getCartEndpoint);
//create cart if not present and add items in it
router.post("/cart/items", authMiddleware, addToCartEndpoint);
// update the quantity 
router.patch("/cart/items/:id", authMiddleware, updateCartItemEndpoint);
//delete the cart items
router.delete("/cart/items/:id", authMiddleware, removeCartItemEndpoint);
//clear the cart and delete the item from cart
router.delete("/cart", authMiddleware, clearCartEndpoint);

export default router;
