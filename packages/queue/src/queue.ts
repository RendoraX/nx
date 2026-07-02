import Bull from "bull";

export const emailQueue = new Bull("email", {
  redis: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

export const orderQueue = new Bull("order", {
  redis: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

export async function enqueueJob(queue: Bull.Queue, name: string, data: unknown) {
  await queue.add(name, data, { attempts: 3, backoff: { type: "exponential", delay: 1000 } });
}
