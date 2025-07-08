import { FastifyInstance } from "fastify";
import {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderTrackingHandler,
  getOrderTrackingByCodeHandler,
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
            "basePrice",
          ],
          properties: {
            originCity: { type: "string" },
            destinationCity: { type: "string" },
            weight: { type: "number" },
            height: { type: "number" },
            width: { type: "number" },
            length: { type: "number" },
            basePrice: { type: "integer", minimum: 1 },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  userId: { type: "integer" },
                  originCity: { type: "string" },
                  destinationCity: { type: "string" },
                  weight: { type: "number" },
                  height: { type: "number" },
                  width: { type: "number" },
                  length: { type: "number" },
                  basePrice: { type: "integer" },
                  trackingCode: { type: "string" },
                  status: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
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
        description:
          "Obtiene todas las órdenes del usuario (historial). Los administradores verán todas las órdenes de todos los usuarios.",
        security: [{ Bearer: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    userId: { type: "integer" },
                    originCity: { type: "string" },
                    destinationCity: { type: "string" },
                    weight: { type: "number" },
                    height: { type: "number" },
                    width: { type: "number" },
                    length: { type: "number" },
                    basePrice: { type: "integer" },
                    trackingCode: { type: "string" },
                    status: { type: "string" },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" },
                  },
                },
              },
            },
          },
        },
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
        description:
          "Obtiene el seguimiento completo de una orden. Los administradores pueden ver cualquier orden.",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number", minimum: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  userId: { type: "integer" },
                  originCity: { type: "string" },
                  destinationCity: { type: "string" },
                  weight: { type: "number" },
                  height: { type: "number" },
                  width: { type: "number" },
                  length: { type: "number" },
                  basePrice: { type: "integer" },
                  trackingCode: { type: "string" },
                  status: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                  statusHistory: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        status: { type: "string" },
                        changed_at: { type: "string" },
                        notes: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    getOrderTrackingHandler
  );

  fastify.get(
    "/tracking/:trackingCode",
    {
      schema: {
        tags: ["Tracking"],
        summary: "Seguimiento por código de radicado",
        description:
          "Obtiene el seguimiento de una orden usando su código de radicado (no requiere autenticación)",
        params: {
          type: "object",
          properties: {
            trackingCode: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  originCity: { type: "string" },
                  destinationCity: { type: "string" },
                  weight: { type: "number" },
                  height: { type: "number" },
                  width: { type: "number" },
                  length: { type: "number" },
                  basePrice: { type: "integer" },
                  trackingCode: { type: "string" },
                  status: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                  statusHistory: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        status: { type: "string" },
                        changed_at: { type: "string" },
                        notes: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    getOrderTrackingByCodeHandler
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
            id: { type: "number", minimum: 1 },
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
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
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
        description:
          "Obtiene el historial de estados de una orden con detalles completos. Los administradores pueden ver cualquier orden.",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number", minimum: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  order: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      userId: { type: "integer" },
                      originCity: { type: "string" },
                      destinationCity: { type: "string" },
                      weight: { type: "number" },
                      height: { type: "number" },
                      width: { type: "number" },
                      length: { type: "number" },
                      basePrice: { type: "integer" },
                      trackingCode: { type: "string" },
                      status: { type: "string" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                    },
                  },
                  statusHistory: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        status: { type: "string" },
                        changed_at: { type: "string" },
                        notes: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    getOrderStatusHistoryHandler
  );
}
