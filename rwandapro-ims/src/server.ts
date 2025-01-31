import http from "http";
import 'dotenv/config';
import { env } from "./config/env";
import { connectDB } from "./config/database";
import logger from "./config/logger";
import app from "./app";
import { redis } from "./utils/cache";

const server = http.createServer(app);
const port = env.PORT || 8080;

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down server...");
  
  server.close(async () => {
    await redis.quit();
    logger.info("Server closed");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Force shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Server startup
const start = async () => {
  try {
    await connectDB();
    
    server.listen(port, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${port}`);
    });

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err);
      shutdown();
    });
    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err);
      shutdown();
    });

  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
