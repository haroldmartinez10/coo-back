import { FastifyInstance } from "fastify";
import {
  createOrderHandler,
  getUserOrdersHandler,
} from "../controllers/OrderController";
import { authMiddleware } from "../middleware/authMiddleware";

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/orders",
    {
      preHandler: authMiddleware,
    },
    createOrderHandler
  );

  fastify.get(
    "/orders",
    {
      preHandler: authMiddleware,
    },
    getUserOrdersHandler
  );
}
