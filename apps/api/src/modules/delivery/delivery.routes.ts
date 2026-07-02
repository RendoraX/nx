import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { acceptDeliveryAssignmentEndpoint, assignDeliveryEndpoint, deliveredEndpoint, listAssignedDeliveriesEndpoint, outForDeliveryEndpoint, pickupDeliveryEndpoint } from "./delivery.controller";

const router = Router();

router.get("/delivery/orders", authMiddleware, listAssignedDeliveriesEndpoint);
router.patch("/delivery/:id/accept", authMiddleware, acceptDeliveryAssignmentEndpoint);
router.patch("/delivery/:id/pickup", authMiddleware, pickupDeliveryEndpoint);
router.patch("/delivery/:id/out-for-delivery", authMiddleware, outForDeliveryEndpoint);
router.patch("/delivery/:id/delivered", authMiddleware, deliveredEndpoint);
router.patch("/admin/orders/:id/assign-delivery", authMiddleware, assignDeliveryEndpoint);

export default router;
