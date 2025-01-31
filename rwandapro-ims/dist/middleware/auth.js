"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
const api_errors_1 = require("../utils/api-errors");
const authenticate = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new api_errors_1.UnauthorizedError("Authentication required");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            if (roles && !roles.includes(decoded.role)) {
                throw new api_errors_1.ForbiddenError("Insufficient permissions");
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            logger_1.default.warn(`JWT Verification failed: ${err.message}`);
            throw new api_errors_1.UnauthorizedError("Invalid or expired token");
        }
    };
};
exports.authenticate = authenticate;
