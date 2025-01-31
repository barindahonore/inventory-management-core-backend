import { Request, Response, NextFunction } from "express";
import xss from "xss-filters";
import crypto from "crypto";
import { env } from "../config/env";

// XSS protection middleware
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sanitize = (obj: Record<string, any>) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = xss.inHTMLData(obj[key]);
      }
    });
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);

  next();
};

// Security headers middleware
export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
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

// CSRF token generation/validation
export const csrf = {
  generateToken: () => {
    return crypto.randomBytes(32).toString("hex");
  },

  validateToken: (req: Request) => {
    const token = req.headers["x-csrf-token"];
    const sessionToken = req.session?.csrfToken;
    
    if (!token || token !== sessionToken) {
      throw new ForbiddenError("Invalid CSRF token");
    }
  }
};
