export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
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

export class ValidationError extends ApiError {
  constructor(issues: Array<{ path: string; message: string }>) {
    super(400, "Validation failed", { errors: issues });
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Insufficient permissions") {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`);
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message = "Too many requests") {
    super(429, message);
  }
}
