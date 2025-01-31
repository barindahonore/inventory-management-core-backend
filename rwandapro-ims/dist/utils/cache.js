"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.cacheResponse = exports.checkCache = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
exports.redis = new ioredis_1.default(env_1.env.REDIS_URL, {
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
});
// Cache middleware for GET requests
const checkCache = (keyPrefix, ttlSeconds = 3600) => {
    return async (req, res, next) => {
        if (req.method !== "GET")
            return next();
        const cacheKey = `${keyPrefix}:${req.originalUrl}`;
        try {
            const cachedData = await exports.redis.get(cacheKey);
            if (cachedData) {
                res.setHeader("X-Cache", "HIT");
                return res.json(JSON.parse(cachedData));
            }
            res.setHeader("X-Cache", "MISS");
            next();
        }
        catch (error) {
            logger_1.default.error("Cache check failed:", error);
            next();
        }
    };
};
exports.checkCache = checkCache;
// Cache response helper
const cacheResponse = async (key, data, ttlSeconds = 3600) => {
    try {
        await exports.redis.setex(key, ttlSeconds, JSON.stringify(data));
    }
    catch (error) {
        logger_1.default.error("Caching failed:", error);
    }
};
exports.cacheResponse = cacheResponse;
// Cache invalidation helper
const invalidateCache = async (patterns) => {
    try {
        const pipeline = exports.redis.pipeline();
        patterns.forEach(pattern => pipeline.del(pattern));
        await pipeline.exec();
    }
    catch (error) {
        logger_1.default.error("Cache invalidation failed:", error);
    }
};
exports.invalidateCache = invalidateCache;
