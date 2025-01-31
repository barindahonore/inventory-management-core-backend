"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSelfOrAdmin = exports.requireRole = void 0;
const api_errors_1 = require("../utils/api-errors");
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new api_errors_1.ForbiddenError("Access denied");
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireSelfOrAdmin = (field = "id") => {
    return (req, res, next) => {
        if (req.user?.role === "ADMIN")
            return next();
        if (req.user?.userId === req.params[field])
            return next();
        throw new api_errors_1.ForbiddenError("Access denied");
    };
};
exports.requireSelfOrAdmin = requireSelfOrAdmin;
