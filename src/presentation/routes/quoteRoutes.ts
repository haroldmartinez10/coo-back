import { FastifyInstance } from "fastify";
import {
  quoteOrderHandler,
  getQuoteHistoryHandler,
} from "../controllers/QuoteController";
import { authMiddleware } from "../middleware/authMiddleware";

export default async function quoteRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/quotes",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Quotes"],
        summary: "Calcular cotización de envío",
        description: "Calcula el precio y detalles de un envío",
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
            weight: { type: "number", minimum: 0.1 },
            height: { type: "number", minimum: 1 },
            width: { type: "number", minimum: 1 },
            length: { type: "number", minimum: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              quote: {
                type: "object",
                properties: {
                  originCity: { type: "string" },
                  destinationCity: { type: "string" },
                  packageDetails: {
                    type: "object",
                    properties: {
                      actualWeight: { type: "number" },
                      volumeWeight: { type: "number" },
                      selectedWeight: { type: "number" },
                      dimensions: {
                        type: "object",
                        properties: {
                          height: { type: "number" },
                          width: { type: "number" },
                          length: { type: "number" },
                        },
                      },
                    },
                  },
                  pricing: {
                    type: "object",
                    properties: {
                      basePrice: { type: "number" },
                      pricePerKg: { type: "number" },
                      totalPrice: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    quoteOrderHandler
  );

  fastify.get(
    "/quotes",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Quotes"],
        summary: "Obtener historial de cotizaciones",
        description: "Obtiene todas las cotizaciones del usuario",
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              quotes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    originCity: { type: "string" },
                    destinationCity: { type: "string" },
                    weight: { type: "number" },
                    totalPrice: { type: "number" },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    getQuoteHistoryHandler
  );
}
