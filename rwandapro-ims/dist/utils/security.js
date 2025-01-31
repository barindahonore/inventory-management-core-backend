"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrf = exports.securityHeaders = exports.sanitizeInput = void 0;
const xss_filters_1 = __importDefault(require("xss-filters"));
const crypto_1 = __importDefault(require("crypto"));
// XSS protection middleware
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "string") {
                obj[key] = xss_filters_1.default.inHTMLData(obj[key]);
            }
        });
    };
    if (req.body)
        sanitize(req.body);
    if (req.params)
        sanitize(req.params);
    if (req.query)
        sanitize(req.query);
    next();
};
exports.sanitizeInput = sanitizeInput;
// Security headers middleware
const securityHeaders = (_req, res, next) => {
    res.set({
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        "Content-Security-Policy": "default-src 'self'",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "same-origin",
        "Permissions-Policy": "geolocation=(self)"
    });
    next();
};
exports.securityHeaders = securityHeaders;
// CSRF token generation/validation
exports.csrf = {
    generateToken: () => {
        return crypto_1.default.randomBytes(32).toString("hex");
    },
    validateToken: (req) => {
        const token = req.headers["x-csrf-token"];
        const sessionToken = req.session?.csrfToken;
        if (!token || token !== sessionToken) {
            throw new ForbiddenError("Invalid CSRF token");
        }
    }
};
