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

router.get("/cart", authMiddleware, getCartEndpoint);
router.post("/cart/items", authMiddleware, addToCartEndpoint);
router.patch("/cart/items/:id", authMiddleware, updateCartItemEndpoint);
router.delete("/cart/items/:id", authMiddleware, removeCartItemEndpoint);
router.delete("/cart", authMiddleware, clearCartEndpoint);

export default router;
