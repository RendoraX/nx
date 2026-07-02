import { logger } from "./logger";

export function errorLogger(error: unknown, context?: Record<string, unknown>) {
  logger.error("unhandled_error", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}
