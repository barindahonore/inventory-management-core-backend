// // // import { Request, Response, NextFunction } from "express";
// // // import Redis from "ioredis";
// // // import { env } from "../config/env";
// // // import { TooManyRequestsError } from "../utils/api-errors";

// // // const redis = new Redis(env.REDIS_URL);

// // // export const rateLimiter = (options: {
// // //   windowMs: number;
// // //   max: number;
// // //   keyPrefix: string;
// // // }) => {
// // //   return async (req: Request, res: Response, next: NextFunction) => {
// // //     const key = `${options.keyPrefix}:${req.ip || req.user?.userId}`;
    
// // //     const current = await redis.incr(key);
// // //     if (current === 1) {
// // //       await redis.expire(key, options.windowMs / 1000);
// // //     }

// // //     if (current > options.max) {
// // //       throw new TooManyRequestsError("Too many requests");
// // //     }

// // //     res.setHeader("X-RateLimit-Limit", options.max);
// // //     res.setHeader("X-RateLimit-Remaining", options.max - current);
    
// // //     next();
// // //   };
// // // };


// // import { Request, Response, NextFunction } from "express";
// // import Redis from "ioredis";
// // import { env } from "../config/env";
// // import { TooManyRequestsError } from "../utils/api-errors";

// // const redis = new Redis(env.REDIS_URL);

// // export const rateLimiter = (options: {
// //   windowMs: number;
// //   max: number;
// //   keyPrefix: string;
// // }) => {
// //   return async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       const key = `${options.keyPrefix}:${req.ip || req.user?.userId}`;
      
// //       const current = await redis.incr(key);
// //       if (current === 1) {
// //         await redis.expire(key, options.windowMs / 1000);
// //       }
      
// //       if (current > options.max) {
// //         return next(new TooManyRequestsError("Too many requests"));
// //       }
      
// //       res.setHeader("X-RateLimit-Limit", options.max.toString());
// //       res.setHeader("X-RateLimit-Remaining", (options.max - current).toString());
      
// //       next();
// //     } catch (error) {
// //       next(error);
// //     }
// //   };
// // };



// import { Request, Response, NextFunction } from "express";
// import Redis from "ioredis";
// import { env } from "../config/env";
// import { TooManyRequestsError } from "../utils/api-errors";

// const redis = new Redis(env.REDIS_URL);

// interface CustomRequest extends Request {
//   user?: { 
//     userId?: string;
//     [key: string]: any;
//   };
// }

// export const rateLimiter = (options: {
//   windowMs: number;
//   max: number;
//   keyPrefix: string;
// }) => {
//   return async (req: CustomRequest, res: Response, next: NextFunction) => {
//     try {
//       const key = `${options.keyPrefix}:${req.ip || req.user?.userId || 'unknown'}`;
      
//       const current = await redis.incr(key);
//       if (current === 1) {
//         await redis.expire(key, options.windowMs / 1000);
//       }
      
//       if (current > options.max) {
//         return next(new TooManyRequestsError("Too many requests"));
//       }
      
//       res.setHeader("X-RateLimit-Limit", options.max.toString());
//       res.setHeader("X-RateLimit-Remaining", (options.max - current).toString());
      
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import { env } from "../config/env";
import { TooManyRequestsError } from "../utils/api-errors";

const redis = new Redis(env.REDIS_URL);

declare global {
  namespace Express {
    interface Request {
      user?: { 
        userId: string;
        role: string;
      };
    }
  }
}

export const rateLimiter = (options: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `${options.keyPrefix}:${req.ip || req.user?.userId || 'unknown'}`;
      
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, options.windowMs / 1000);
      }
      
      if (current > options.max) {
        return next(new TooManyRequestsError("Too many requests"));
      }
      
      res.setHeader("X-RateLimit-Limit", options.max.toString());
      res.setHeader("X-RateLimit-Remaining", (options.max - current).toString());
      
      next();
    } catch (error) {
      next(error);
    }
  };
};