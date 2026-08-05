import { Router } from "express";
import { forgotPasswordInitEndpoint, getAllSessionEndpoint, loginEndpoint, logoutAllDevicesEndpoint, logoutEndpoint, meEndpoint, registerEndpoint, resendVerificationEndpoint, resetPasswordEndpoint, rotateRefreshTokenEndpoint, sessionRevokeEndpoint, updatePasswordEndpoint, verificationTokenEndpoint } from "./auth.controller";
import {authMiddleware} from '../../middleware/auth.middleware'
import {guestMiddleware} from '../../middleware/guest.middleware'
import { securityHeadersMiddleware } from '../../middleware/security.middleware'
const router = Router();


router.post("/login" , loginEndpoint);
router.post("/register" ,registerEndpoint);
router.post('/resend-verification' , resendVerificationEndpoint);
router.post("/forgot-pass" , forgotPasswordInitEndpoint);
router.post("/verify-email" , verificationTokenEndpoint);
router.post("/reset-pass" , resetPasswordEndpoint);
router.post("/logout" , logoutEndpoint);
router.post("/logout-all" , logoutAllDevicesEndpoint);
router.post("/rt-token" , rotateRefreshTokenEndpoint);

router.get(
    '/me' ,
    authMiddleware,
    securityHeadersMiddleware,
    meEndpoint
     )



     //session routes


router.get(
    '/account/sessions',
    authMiddleware,
    getAllSessionEndpoint
);

router.post(
    '/account/sessions/:sessionId/revoke',
    authMiddleware,
    sessionRevokeEndpoint
);

router.put(
    '/account/cred/update',
    authMiddleware,
    updatePasswordEndpoint
)
export default router;