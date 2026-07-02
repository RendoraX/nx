import { createClient } from "redis";

export const redisClient = createClient({ url: process.env.REDIS_URL || "redis://127.0.0.1:6379" });

redisClient.on("error", (err) => console.error("Redis client error", err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
