"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const env_2 = require("./env");
const logger_1 = __importDefault(require("./logger"));
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
const prisma = new client_1.PrismaClient({
    log: [
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" }
    ],
    // For production connection pooling, use URL parameters instead
    datasourceUrl: env_2.DATABASE_URL
    // datasourceUrl: env.NODE_ENV === "production" 
    //   ? `${env.DATABASE_URL}?connection_limit=10`
    //   : env.DATABASE_URL
});
exports.prisma = prisma;
// Connection handling
const connectDB = async () => {
    try {
        if (env_1.env.NODE_ENV !== "test") {
            await prisma.$connect();
            logger_1.default.info("Database connected successfully");
        }
    }
    catch (error) {
        logger_1.default.error("Database connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Error handling
prisma.$on("warn", (e) => logger_1.default.warn(e.message));
prisma.$on("error", (e) => logger_1.default.error(e.message));
// Graceful shutdown
const shutdown = async () => {
    await prisma.$disconnect();
    logger_1.default.info("Database connection closed");
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
