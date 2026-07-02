import { Worker, Job } from "bullmq";

export const emailWorker = new Worker(
  "email",
  async (job: Job) => {
    console.log(`[queue] processing ${job.name}`, job.data);
  },
  {
    connection: { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" },
  },
);
