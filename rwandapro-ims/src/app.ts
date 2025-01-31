import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
// import { connectDB } from "./config/database";
import logger from "./config/logger";
import { securityHeaders, sanitizeInput } from "./utils/security";
import { rateLimiter } from "./middleware/rate-limiter";
import { ApiError, NotFoundError } from "./utils/api-errors";
import authRoutes from "./modules/auth/routes";
// import inventoryRoutes from "./modules/inventory/routes";
// import rraRoutes from "./modules/rra/routes";

const app = express();

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: env.NODE_ENV === "production" ? env.CLIENT_URL : "*" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, max: 100,
  keyPrefix: ""
}));

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/inventory", inventoryRoutes);
// app.use("/api/v1/rra", rraRoutes);

// 404 Handler
app.use(() => {
  throw new NotFoundError();
});

// Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err.toJSON());
  } else {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        code: 500
      }
    });
  }
});

export default app;
