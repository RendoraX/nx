import { logger } from "../../../../packages/logger/src";

export async function cleanupExpiredTokens() {
  logger.info("cleanup_expired_tokens_job_started");
  return { ok: true };
}
