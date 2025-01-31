"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    toJSON() {
        return {
            error: {
                message: this.message,
                code: this.statusCode,
                details: this.details
            }
        };
    }
}
exports.ApiError = ApiError;
class ValidationError extends ApiError {
    constructor(issues) {
        super(400, "Validation failed", { errors: issues });
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends ApiError {
    constructor(message = "Authentication required") {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = "Insufficient permissions") {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ApiError {
    constructor(resource = "Resource") {
        super(404, `${resource} not found`);
    }
}
exports.NotFoundError = NotFoundError;
class TooManyRequestsError extends ApiError {
    constructor(message = "Too many requests") {
        super(429, message);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
