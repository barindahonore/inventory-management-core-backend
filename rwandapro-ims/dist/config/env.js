"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(8080),
    // DATABASE_URL: z.string().url(),
    DATABASE_URL_DEV: zod_1.z.string().url(),
    DATABASE_URL_PROD: zod_1.z.string().url(),
    DATABASE_URL_TEST: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    CLIENT_URL: zod_1.z.string().url(),
    RRA_APP_ID: zod_1.z.string().optional(),
    RRA_API_KEY: zod_1.z.string().optional(),
    PROMETHEUS_METRICS_PORT: zod_1.z.coerce.number().default(9090),
    POSTGRES_USER: zod_1.z.string().default("postgres"),
    POSTGRES_PASSWORD: zod_1.z.string().default("postgres"),
    POSTGRES_DB: zod_1.z.string().default("rwandapro")
});
exports.env = envSchema.parse(process.env);
exports.DATABASE_URL = {
    development: exports.env.DATABASE_URL_DEV,
    production: exports.env.DATABASE_URL_PROD,
    test: exports.env.DATABASE_URL_TEST
}[exports.env.NODE_ENV];
