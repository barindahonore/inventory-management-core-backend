import express from "express";
import { register, login, refreshToken, logout } from "./controller";
import { authenticate } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rate-limiter";
import { loginSchema, registerSchema } from "./{schemas}/auth.schema";
import { validate } from "../../middleware/validator";

const router = express.Router();

router.post(
  "/register",
  rateLimiter({
    windowMs: 60 * 1000, max: 5,
    keyPrefix: "register"
  }),
  validate({ body: registerSchema }), // Add middleware here
  register
);

router.post(
  "/login",
  rateLimiter({
    windowMs: 60 * 1000, max: 10,
    keyPrefix: "login"
  }),
  validate({ body: loginSchema }), // Add middleware here
  login
);

router.post(
  "/refresh",
  rateLimiter({
    windowMs: 60 * 1000, max: 5,
    keyPrefix: ""
  }),
  refreshToken
);

router.post(
  "/logout",
  authenticate(),
  logout
);

export default router;