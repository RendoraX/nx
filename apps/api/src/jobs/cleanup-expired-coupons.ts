import { logger } from "../../../../packages/logger/src";

export async function cleanupExpiredCoupons() {
  logger.info("cleanup_expired_coupons_job_started");
  return { ok: true };
}
