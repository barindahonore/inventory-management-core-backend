import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  // DATABASE_URL: z.string().url(),
  DATABASE_URL_DEV: z.string().url(),
  DATABASE_URL_PROD: z.string().url(),
  DATABASE_URL_TEST: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CLIENT_URL: z.string().url(),
  RRA_APP_ID: z.string().optional(),
  RRA_API_KEY: z.string().optional(),
  PROMETHEUS_METRICS_PORT: z.coerce.number().default(9090),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  POSTGRES_DB: z.string().default("rwandapro")
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
export const DATABASE_URL = {
  development: env.DATABASE_URL_DEV,
  production: env.DATABASE_URL_PROD,
  test: env.DATABASE_URL_TEST
}[env.NODE_ENV];
