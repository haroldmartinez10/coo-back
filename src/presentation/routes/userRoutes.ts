import { FastifyInstance } from "fastify";
import {
  loginUserHandler,
  registerUserHandler,
} from "../controllers/UserController";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/register", registerUserHandler);
  fastify.post("/login", loginUserHandler);
}
