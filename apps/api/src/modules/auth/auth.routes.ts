import { Router } from "express";
import { forgotPasswordInitEndpoint, loginEndpoint, logoutAllDevicesEndpoint, logoutEndpoint, registerEndpoint, resetPasswordEndpoint, verificationTokenEndpoint } from "./auth.controller";

const router = Router();


router.post("/login" , loginEndpoint);
router.post("/signup" ,registerEndpoint);
router.post("/forgot-pass" , forgotPasswordInitEndpoint);
router.post("/verify" , verificationTokenEndpoint);
router.post("/reset-pass" , resetPasswordEndpoint);
router.get("/logout" , logoutEndpoint);
router.get("/logout-all" , logoutAllDevicesEndpoint);


export default router;