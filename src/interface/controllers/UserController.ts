import { LoginUserDTO, RegisterUserDTO } from "@application/dtos/user.dto";
import { LoginUserUseCase } from "@application/use-cases/login-user.usecase";
import { RegisterUserUseCase } from "@application/use-cases/register-user.usecase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { JwtService } from "@application/services/JwtService";
import { FastifyReply, FastifyRequest } from "fastify";

export const loginUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const repo = new UserRepository();
  const jwtService = new JwtService();
  const useCase = new LoginUserUseCase(repo, jwtService);
  try {
    const result = await useCase.execute(request.body as LoginUserDTO);
    reply.code(200).send({
      message: "Usuario autenticado exitosamente",
      token: result.token,
      user: {
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });
  } catch (err) {
    reply.code(400).send({ error: (err as Error).message });
  }
};

export const registerUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const repo = new UserRepository();

  const useCase = new RegisterUserUseCase(repo);
  try {
    const user = await useCase.execute(request.body as RegisterUserDTO);
    reply.code(201).send({
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    reply.code(400).send({ error: (err as Error).message });
  }
};
