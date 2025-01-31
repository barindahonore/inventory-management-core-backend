import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";
import { env } from "../../config/env";
import logger from "../../config/logger";
import { RegisterInput, LoginInput } from "./{schemas}/auth.schema";
import { ForbiddenError, UnauthorizedError } from "../../utils/api-errors";

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export class AuthService {
  async register(payload: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (existingUser) {
      throw new ForbiddenError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
    
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone
      }
    });

    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken
    };
  }

  async login(payload: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user || !(await bcrypt.compare(payload.password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as {
        userId: string;
        role: string;
      };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) throw new Error("User not found");

      const { accessToken } = this.generateTokens(user.id, user.role);
      return { accessToken };
    } catch (error) {
      logger.error("Refresh token failed:", error);
      throw new UnauthorizedError("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    // Implement token invalidation logic here
    return { message: "Logged out successfully" };
  }

  private generateTokens(userId: string, role: string) {
    return {
      accessToken: jwt.sign(
        { userId, role },
        env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      ),
      refreshToken: jwt.sign(
        { userId, role },
        env.JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      )
    };
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
