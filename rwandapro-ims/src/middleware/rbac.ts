import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/api-errors";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Access denied");
    }
    next();
  };
};

export const requireSelfOrAdmin = (field = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === "ADMIN") return next();
    if (req.user?.userId === req.params[field]) return next();
    
    throw new ForbiddenError("Access denied");
  };
};
