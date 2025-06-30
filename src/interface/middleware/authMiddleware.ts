import { FastifyRequest, FastifyReply } from "fastify";
import { JwtService } from "@application/services/JwtService";

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: number;
    email: string;
    name: string;
    role: "admin" | "user";
  };
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ error: "Authorization header required" });
    }

    const token = authHeader.substring(7);

    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);

    (request as AuthenticatedRequest).user = decoded;
  } catch (error) {
    return reply.code(401).send({ error: "Invalid token" });
  }
};

export const adminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await authMiddleware(request, reply);

  const user = (request as AuthenticatedRequest).user;

  if (user.role !== "admin") {
    return reply.code(403).send({ error: "Admin access required" });
  }
};

export const userOrAdminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await authMiddleware(request, reply);

  const user = (request as AuthenticatedRequest).user;

  if (user.role !== "admin" && user.role !== "user") {
    return reply.code(403).send({ error: "User access required" });
  }
};
