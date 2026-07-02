import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { createPaymentOrderEndpoint, failPaymentEndpoint, paymentDetailsEndpoint, verifyPaymentEndpoint, webhookEndpoint } from "./payments.controller";

const router = Router();

router.post("/payments/create-order", authMiddleware, createPaymentOrderEndpoint);
router.post("/payments/verify", authMiddleware, verifyPaymentEndpoint);
router.post("/payments/webhook", webhookEndpoint);
router.get("/payments/:orderId", authMiddleware, paymentDetailsEndpoint);
router.post("/payments/:orderId/fail", authMiddleware, failPaymentEndpoint);

export default router;
