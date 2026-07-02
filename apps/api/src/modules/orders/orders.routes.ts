import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { cancelOrderEndpoint, createOrderEndpoint, getOrderEndpoint, listOrdersEndpoint } from "./orders.controller";

const router = Router();

router.get("/orders", authMiddleware, listOrdersEndpoint);
router.get("/orders/:id", authMiddleware, getOrderEndpoint);
router.post("/orders", authMiddleware, createOrderEndpoint);
router.post("/orders/:id/cancel", authMiddleware, cancelOrderEndpoint);

export default router;
