import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateCouponEndpoint } from "./coupons.controller";

const router = Router();

router.post("/coupons/validate", authMiddleware, validateCouponEndpoint);

export default router;
