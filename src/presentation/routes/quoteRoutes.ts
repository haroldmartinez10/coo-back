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
                  packageDetails: { type: "object" },
                  pricing: { type: "object" },
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
        security: [{ Bearer: [] }],
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
                    createdAt: { type: "string" },
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
