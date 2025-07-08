import { FastifyRequest, FastifyReply } from "fastify";
import { JwtService } from "@application/services/JwtService";
import { AuthenticatedUser } from "@application/dtos/user.dto";

export interface AuthenticatedRequest extends FastifyRequest {
  user: AuthenticatedUser;
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .code(401)
        .send({ error: "Encabezado de autorización requerido" });
    }

    const token = authHeader.substring(7);

    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);

    (request as AuthenticatedRequest).user = decoded;
  } catch (error) {
    return reply.code(401).send({ error: "Token inválido" });
  }
};

export const adminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await authMiddleware(request, reply);

  const user = (request as AuthenticatedRequest).user;

  if (user.role !== "admin") {
    return reply.code(403).send({ error: "Acceso de administrador requerido" });
  }
};

export const userOrAdminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await authMiddleware(request, reply);

  const user = (request as AuthenticatedRequest).user;

  if (user.role !== "admin" && user.role !== "user") {
    return reply.code(403).send({ error: "Acceso de usuario requerido" });
  }
};
