import { FastifyInstance } from "fastify";
import {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderTrackingHandler,
  updateOrderStatusHandler,
  getOrderStatusHistoryHandler,
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

  // Obtener seguimiento de una orden específica (con historial completo)
  fastify.get(
    "/orders/:id/tracking",
    {
      preHandler: authMiddleware,
    },
    getOrderTrackingHandler
  );

  // Actualizar estado de una orden
  fastify.put(
    "/orders/:id/status",
    {
      preHandler: authMiddleware,
    },
    updateOrderStatusHandler
  );

  // Obtener solo el historial de estados de una orden
  fastify.get(
    "/orders/:id/status-history",
    {
      preHandler: authMiddleware,
    },
    getOrderStatusHistoryHandler
  );
}
