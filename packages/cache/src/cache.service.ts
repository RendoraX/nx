import { connectRedis, redisClient } from "./redis";

export const CACHE_TTL_SECONDS = 300;

export async function getCached<T>(key: string): Promise<T | null> {
  await connectRedis();
  const cached = await redisClient.get(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

export async function setCached<T>(key: string, value: T, ttlSeconds = CACHE_TTL_SECONDS) {
  await connectRedis();
  await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
}

export async function deleteCached(key: string) {
  await connectRedis();
  await redisClient.del(key);
}

export async function cacheKey(prefix: string, value: string) {
  return `${prefix}:${value}`;
}
