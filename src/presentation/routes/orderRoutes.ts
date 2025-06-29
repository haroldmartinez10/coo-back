import { FastifyInstance } from "fastify";
import {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderTrackingHandler,
  updateOrderStatusHandler,
  getOrderStatusHistoryHandler,
} from "../controllers/OrderController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/orders",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Orders"],
        summary: "Crear nueva orden de envío",
        description: "Crea una nueva orden de envío",
        security: [{ Bearer: [] }],
        body: {
          type: "object",
          required: [
            "originCity",
            "destinationCity",
            "weight",
            "height",
            "width",
            "length",
          ],
          properties: {
            originCity: { type: "string" },
            destinationCity: { type: "string" },
            weight: { type: "number" },
            height: { type: "number" },
            width: { type: "number" },
            length: { type: "number" },
          },
        },
      },
    },
    createOrderHandler
  );

  fastify.get(
    "/orders",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Orders"],
        summary: "Obtener órdenes del usuario",
        description: "Obtiene todas las órdenes del usuario",
        security: [{ Bearer: [] }],
      },
    },
    getUserOrdersHandler
  );

  fastify.get(
    "/orders/:id/tracking",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Orders"],
        summary: "Obtener seguimiento de orden",
        description: "Obtiene el seguimiento completo de una orden",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    getOrderTrackingHandler
  );

  fastify.put(
    "/orders/:id/status",
    {
      preHandler: adminMiddleware,
      schema: {
        tags: ["Orders"],
        summary: "Actualizar estado de orden",
        description:
          "Actualiza el estado de una orden (Requiere permisos de administrador)",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["newStatus"],
          properties: {
            newStatus: {
              type: "string",
              enum: ["pending", "in_transit", "delivered"],
            },
            notes: { type: "string" },
          },
        },
      },
    },
    updateOrderStatusHandler
  );

  fastify.get(
    "/orders/:id/status-history",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Orders"],
        summary: "Obtener historial de estados",
        description: "Obtiene el historial de estados de una orden",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    getOrderStatusHistoryHandler
  );
}
