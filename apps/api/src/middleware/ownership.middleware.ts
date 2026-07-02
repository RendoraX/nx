import type { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string };
}

export function ownershipMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const resourceUserId = req.params.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (resourceUserId && resourceUserId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}
