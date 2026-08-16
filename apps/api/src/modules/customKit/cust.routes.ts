import { Router } from "express";
import { createCustomKitOrderEndpoint } from "./cust.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();


router.post("/custKits/order" , authMiddleware , createCustomKitOrderEndpoint)


export default router