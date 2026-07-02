import { Router } from "express";
import { allCategoryEndpoint, categoryAddEndpoint, categoryDeleteEndpoint, categoryUpdateEndpoint } from "./categories.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/cat"  , authMiddleware, categoryAddEndpoint);
router.get("/cat" , authMiddleware , allCategoryEndpoint);

router.patch("/cat/update" , authMiddleware , categoryUpdateEndpoint);
router.delete("/cat/delete" , authMiddleware , categoryDeleteEndpoint);
export default router;