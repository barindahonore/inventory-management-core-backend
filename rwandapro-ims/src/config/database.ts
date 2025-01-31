import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { DATABASE_URL } from "./env"; 
import logger from "./logger";

// const prisma = new PrismaClient({
//   log: [
//     { level: "warn", emit: "event" },
//     { level: "error", emit: "event" }
//   ],
//   datasourceUrl: env.DATABASE_URL,
//   // Connection pool configuration
//   ...(env.NODE_ENV === "production" && {
//     datasources: {
//       db: {
//         url: env.DATABASE_URL,
//         connectionLimit: 10
//       }
//     }
//   })
// });

const prisma = new PrismaClient({
  log: [
    { level: "warn", emit: "event" },
    { level: "error", emit: "event" }
  ],
  // For production connection pooling, use URL parameters instead
  datasourceUrl: DATABASE_URL
  // datasourceUrl: env.NODE_ENV === "production" 
  //   ? `${env.DATABASE_URL}?connection_limit=10`
  //   : env.DATABASE_URL
});

// Connection handling
const connectDB = async () => {
  try {
    if (env.NODE_ENV !== "test") {
      await prisma.$connect();
      logger.info("Database connected successfully");
    }
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
};

// Error handling
prisma.$on("warn", (e) => logger.warn(e.message));
prisma.$on("error", (e) => logger.error(e.message));

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect();
  logger.info("Database connection closed");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { prisma, connectDB };