import { Router } from "express";
import { guestMiddleware } from "../middleware/guest.middleware";
import { forgotPasswordInitEndpoint, loginEndpoint, logoutAllDevicesEndpoint, logoutEndpoint, registerEndpoint, resetPasswordEndpoint, verificationTokenEndpoint } from "../modules/auth/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";


const route = Router();

route.post(
    "/auth/login" ,
     guestMiddleware ,
     loginEndpoint
);

route.post(
    "/auth/register",
    guestMiddleware,
    registerEndpoint
);

route.post(
    "/auth/vt",
    guestMiddleware,
    verificationTokenEndpoint
);

route.post(
    "/auth/forgot-password",
    guestMiddleware,
    forgotPasswordInitEndpoint
);

route.post(
    "/auth/reset-pass",
    guestMiddleware,
    resetPasswordEndpoint
);

route.post(
    "/auth/logout",
    authMiddleware,
    logoutEndpoint
);

route.post(
    "/auth/session/logout",
    authMiddleware,
    logoutAllDevicesEndpoint
);


export default route;