import { FastifyInstance } from "fastify";
import {
  loginUserHandler,
  registerUserHandler,
} from "presentation/controllers/UserController";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Users"],
        summary: "Registrar nuevo usuario",
        description: "Crea una nueva cuenta de usuario en el sistema",
        body: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: { type: "string", minLength: 6 },
            name: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              message: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  email: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    registerUserHandler
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Users"],
        summary: "Iniciar sesión",
        description: "Autentica un usuario y devuelve un token JWT",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    loginUserHandler
  );
}
