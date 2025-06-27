import { LoginUserDTO, RegisterUserDTO } from "@application/dtos/user.dto";
import { LoginUserUseCase } from "@application/use-cases/login-user.usecase";
import { RegisterUserUseCase } from "@application/use-cases/register-user.usecase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { FastifyReply, FastifyRequest } from "fastify";

export const loginUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const repo = new UserRepository();
  const useCase = new LoginUserUseCase(repo);
  try {
    await useCase.execute(request.body as LoginUserDTO);
    reply.code(201).send({ message: "User registered" });
  } catch (err) {
    reply.code(400).send({ error: err as Error });
  }
};
export const registerUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const repo = new UserRepository();
  const useCase = new RegisterUserUseCase(repo);
  try {
    await useCase.execute(request.body as RegisterUserDTO);
    reply.code(201).send({ message: "User registered" });
  } catch (err) {
    reply.code(400).send({ error: err as Error });
  }
};
