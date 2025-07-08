import jwt from "jsonwebtoken";
import { env } from "@infrastructure/config/env";
import { UserPayload } from "@application/dtos/user.dto";

export class JwtService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    this.secretKey = env.JWT_SECRET;
    this.expiresIn = env.JWT_EXPIRES_IN;
  }

  generateToken(payload: UserPayload): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): UserPayload {
    try {
      return jwt.verify(token, this.secretKey) as UserPayload;
    } catch (error) {
      throw new Error("Token inválido");
    }
  }
}
