import { Request, Response } from "express";
import { env } from "../../config/env";
import { AuthService } from "./service";
// import { loginSchema, registerSchema, refreshTokenSchema } from "./{schemas}/auth.schema";
// import { validate } from "../../middleware/validator";

const authService = new AuthService();

// export const register = async (req: Request, res: Response) => {
//   const userData = validate(registerSchema, req.body);
//   const result = await authService.register(userData);
  
//   res.status(201).json({
//     success: true,
//     data: result
//   });
// };

export const register = async (req: Request, res: Response) => {
  // Get validated data from request object
  const userData = req.body;
  const result = await authService.register(userData);
  
  res.status(201).json({
    success: true,
    data: result
  });
};

export const login = async (req: Request, res: Response) => {
  // const credentials = validate(loginSchema, req.body);
  const credentials = req.body;
  const result = await authService.login(credentials);
  
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);
  
  res.json({
    success: true,
    data: result
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  await authService.logout(req.user!.userId);
  
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};