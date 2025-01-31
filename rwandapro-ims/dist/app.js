"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
// import { connectDB } from "./config/database";
const logger_1 = __importDefault(require("./config/logger"));
const security_1 = require("./utils/security");
const rate_limiter_1 = require("./middleware/rate-limiter");
const api_errors_1 = require("./utils/api-errors");
// import authRoutes from "./modules/auth/routes";
// import inventoryRoutes from "./modules/inventory/routes";
// import rraRoutes from "./modules/rra/routes";
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json({ limit: "10kb" }));
app.use((0, cors_1.default)({ origin: env_1.env.NODE_ENV === "production" ? env_1.env.CLIENT_URL : "*" }));
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(security_1.securityHeaders);
app.use(security_1.sanitizeInput);
app.use((0, rate_limiter_1.rateLimiter)({
    windowMs: 15 * 60 * 1000, max: 100,
    keyPrefix: ""
}));
// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// API Routes
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/inventory", inventoryRoutes);
// app.use("/api/v1/rra", rraRoutes);
// 404 Handler
app.use(() => {
    throw new api_errors_1.NotFoundError();
});
// Error Handler
app.use((err, req, res, next) => {
    if (err instanceof api_errors_1.ApiError) {
        res.status(err.statusCode).json(err.toJSON());
    }
    else {
        logger_1.default.error(`Unhandled error: ${err.message}`, { stack: err.stack });
        res.status(500).json({
            error: {
                message: "Internal Server Error",
                code: 500
            }
        });
    }
});
exports.default = app;
