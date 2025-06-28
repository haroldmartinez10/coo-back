import jwt from "jsonwebtoken";
import { env } from "@infrastructure/config/env";

export class JwtService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    this.secretKey = env.JWT_SECRET;
    this.expiresIn = env.JWT_EXPIRES_IN;
  }

  generateToken(payload: {
    userId: number;
    email: string;
    name: string;
  }): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
