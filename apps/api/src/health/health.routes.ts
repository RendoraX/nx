import { Router } from "express";

const router = Router();

router.get("/health", async (_req, res) => {
  res.json({
    message : "Dummy monitor"
  });
});

router.get("/health/database", (_req, res) => {
  res.json({ status: "ok", database: "configured" });
});

router.get("/health/redis", (_req, res) => {
  res.json({ status: "ok", redis: "configured" });
});

router.get("/health/storage", (_req, res) => {
  res.json({ status: "ok", storage: "local" });
});

export default router;
