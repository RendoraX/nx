import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { guestMiddleware } from "../../middleware/guest.middleware";
import { securityHeadersMiddleware } from "../../middleware/security.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import upload from '../../utils/multer'
import { createCustomPoojaKitEndpoint, deletePoojaKitEndpoint, getAllCustomkitEndpoint, updatePoojaKitEndpoint } from "./admin.controller";

const router = Router();

router.post(
    '/admin/custkits/',
    securityHeadersMiddleware,
    authMiddleware,
    adminMiddleware,
    guestMiddleware,
    upload.any(),
    createCustomPoojaKitEndpoint
);

router.get(
    '/custkits',
    securityHeadersMiddleware,
    authMiddleware,
    guestMiddleware,
    upload.any(),
    getAllCustomkitEndpoint
);

router.patch(
    '/admin/custkits/:id',
    securityHeadersMiddleware,
    authMiddleware,
    adminMiddleware,
    guestMiddleware,
    upload.any(),
    updatePoojaKitEndpoint
);

router.delete(
    '/admin/custkits/:id',
    securityHeadersMiddleware,
    authMiddleware,
    adminMiddleware,
    guestMiddleware,
    upload.any(),
    deletePoojaKitEndpoint
);
export default router