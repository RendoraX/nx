import { logger } from "./logger";

export function requestLogger(req: any, _res: any, next: any) {
  const requestId = req.headers["x-request-id"] || `req-${Date.now()}`;
  req.requestId = requestId;
  const startedAt = Date.now();

  logger.info("incoming_request", { requestId, method: req.method, path: req.originalUrl, userId: req.user?.id });

  _res.on("finish", () => {
    logger.info("request_completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: _res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: req.user?.id,
    });
  });

  next();
}
