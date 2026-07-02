import { logger } from "../../logger/src";

export function collectMetrics() {
  const usage = process.memoryUsage();
  logger.info("metrics_collected", {
    rss: usage.rss,
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
  });
}
