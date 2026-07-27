import { Router } from "express";
import { createAddressEndpoint, deleteAddressEndpoint, getAddressesEndpoint, getAllUsersEndpoint, getAllUsersSummaryEndpoint } from "./users.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { guestMiddleware } from "../../middleware/guest.middleware";

const router = Router();

//admin only router
router.get(
    '/admin/users',
    getAllUsersEndpoint
)

//admin only router
router.get(
    '/admin/users/summary',
    getAllUsersSummaryEndpoint
)



//user only route
router.post(
    '/account/address',
    authMiddleware,
    guestMiddleware,
    createAddressEndpoint
);

//user use
router.get(
    '/account/addresses',
    authMiddleware,
    guestMiddleware,
    getAddressesEndpoint
);

//user use 
router.delete(
    '/account/address/:id/d',
    authMiddleware,
    guestMiddleware,
    deleteAddressEndpoint
)

export default router