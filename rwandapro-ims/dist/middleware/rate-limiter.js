"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const api_errors_1 = require("../utils/api-errors");
const redis = new ioredis_1.default(env_1.env.REDIS_URL);
const rateLimiter = (options) => {
    return async (req, res, next) => {
        const key = `${options.keyPrefix}:${req.ip || req.user?.userId}`;
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, options.windowMs / 1000);
        }
        if (current > options.max) {
            throw new api_errors_1.TooManyRequestsError("Too many requests");
        }
        res.setHeader("X-RateLimit-Limit", options.max);
        res.setHeader("X-RateLimit-Remaining", options.max - current);
        next();
    };
};
exports.rateLimiter = rateLimiter;
