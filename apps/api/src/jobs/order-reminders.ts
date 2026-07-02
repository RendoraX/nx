import { logger } from "../../../../packages/logger/src";

export async function orderReminderJob() {
  logger.info("order_reminder_job_started");
  return { ok: true };
}
