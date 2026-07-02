import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getAdminOrderEndpoint, listAdminOrdersEndpoint, updateAdminOrderStatusEndpoint } from "./admin-order.controller";

const router = Router();

router.get("/admin/orders", authMiddleware, listAdminOrdersEndpoint);
router.get("/admin/orders/:id", authMiddleware, getAdminOrderEndpoint);
router.patch("/admin/orders/:id/status", authMiddleware, updateAdminOrderStatusEndpoint);

export default router;
