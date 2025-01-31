import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import logger from "../config/logger";
import { ForbiddenError, UnauthorizedError } from "../utils/api-errors";

declare module "express" {
  interface Request {
    user?: {
      userId: string;
      role: string;
    };
  }
}

export const authenticate = (roles?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        role: string;
      };
      
      if (roles && !roles.includes(decoded.role)) {
        throw new ForbiddenError("Insufficient permissions");
      }

      req.user = decoded;
      next();
    } catch (err) {
      logger.warn(`JWT Verification failed: ${(err as Error).message}`);
      throw new UnauthorizedError("Invalid or expired token");
    }
  };
};
