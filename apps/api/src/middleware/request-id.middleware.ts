import type { Request, Response, NextFunction } from "express";

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction) {
  const requestId = req.headers["x-request-id"] || `req-${Date.now()}`;
  req.headers["x-request-id"] = Array.isArray(requestId) ? requestId[0] : requestId;
  next();
}
