import Redis from "ioredis";
import { env } from "../config/env";
import logger from "../config/logger";

export const redis = new Redis(env.REDIS_URL, {
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
});

// Cache middleware for GET requests
export const checkCache = (keyPrefix: string, ttlSeconds = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();
    
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cachedData));
      }
      res.setHeader("X-Cache", "MISS");
      next();
    } catch (error) {
      logger.error("Cache check failed:", error);
      next();
    }
  };
};

// Cache response helper
export const cacheResponse = async (
  key: string,
  data: unknown,
  ttlSeconds = 3600
) => {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    logger.error("Caching failed:", error);
  }
};

// Cache invalidation helper
export const invalidateCache = async (patterns: string[]) => {
  try {
    const pipeline = redis.pipeline();
    patterns.forEach(pattern => pipeline.del(pattern));
    await pipeline.exec();
  } catch (error) {
    logger.error("Cache invalidation failed:", error);
  }
};
