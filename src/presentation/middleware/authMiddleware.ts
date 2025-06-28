import { FastifyRequest, FastifyReply } from "fastify";
import { JwtService } from "@application/services/JwtService";

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

    (request as any).user = decoded;
  } catch (error) {
    return reply.code(401).send({ error: "Invalid token" });
  }
};
