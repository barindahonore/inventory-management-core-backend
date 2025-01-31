import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: JwtPayload & Partial<User>;
      startTime?: bigint;
    }

    interface Response {
      paginatedResult?: any;
    }
  }
}

// Required for TypeScript to recognize augmented types
export {};