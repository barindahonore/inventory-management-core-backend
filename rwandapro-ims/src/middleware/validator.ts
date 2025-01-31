// import { Request, Response, NextFunction } from "express";
// import { z, ZodError } from "zod";
// import { ValidationError } from "../utils/api-errors";

// export const validate = (schema: {
//   body?: z.ZodSchema<any>;
//   params?: z.ZodSchema<any>;
//   query?: z.ZodSchema<any>;
// }) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (schema.body) schema.body.parse(req.body);
//       if (schema.params) schema.params.parse(req.params);
//       if (schema.query) schema.query.parse(req.query);
//       next();
//     } catch (err) {
//       if (err instanceof ZodError) {
//         const issues = err.issues.map(issue => ({
//           path: issue.path.join('.'),
//           message: issue.message
//         }));
//         throw new ValidationError("Validation failed", issues);
//       }
//       next(err);
//     }
//   };
// };

// src/middleware/validator.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../utils/api-errors";

declare module "express" {
  interface Request {
    validatedData?: any;
  }
}

export const validate = (schema: {
  body?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      
      // Store validated data in request object
      req.validatedData = {
        body: req.body,
        params: req.params,
        query: req.query
      };
      
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }));
        next(new ValidationError(issues));
      } else {
        next(err);
      }
    }
  };
};

// Partial validation for PATCH requests
export const validatePartial = (schema: z.ZodSchema<any>) => {
  return validate({
    body: schema.partial()
  });
};