import { logger } from "./logger";

export function auditLogger(action: string, entity: string, entityId?: string, metadata?: Record<string, unknown>, userId?: string) {
  logger.info("audit_event", { action, entity, entityId, metadata, userId });
}
