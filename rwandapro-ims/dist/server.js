"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = __importDefault(require("./config/logger"));
const app_1 = __importDefault(require("./app"));
const cache_1 = require("./utils/cache");
const server = http_1.default.createServer(app_1.default);
const port = env_1.env.PORT || 8080;
// Graceful shutdown
const shutdown = async () => {
    logger_1.default.info("Shutting down server...");
    server.close(async () => {
        await cache_1.redis.quit();
        logger_1.default.info("Server closed");
        process.exit(0);
    });
    setTimeout(() => {
        logger_1.default.error("Force shutdown after timeout");
        process.exit(1);
    }, 10000);
};
// Server startup
const start = async () => {
    try {
        await (0, database_1.connectDB)();
        server.listen(port, () => {
            logger_1.default.info(`Server running in ${env_1.env.NODE_ENV} mode on port ${port}`);
        });
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
        process.on("uncaughtException", (err) => {
            logger_1.default.error("Uncaught Exception:", err);
            shutdown();
        });
        process.on("unhandledRejection", (err) => {
            logger_1.default.error("Unhandled Rejection:", err);
            shutdown();
        });
    }
    catch (err) {
        logger_1.default.error("Failed to start server:", err);
        process.exit(1);
    }
};
start();
