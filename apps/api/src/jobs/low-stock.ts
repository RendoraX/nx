import { logger } from "../../../../packages/logger/src";

export async function lowStockAlertJob() {
  logger.info("low_stock_alert_job_started");
  return { ok: true };
}
