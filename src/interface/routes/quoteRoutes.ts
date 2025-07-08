import { FastifyInstance } from "fastify";
import { quoteOrderHandler } from "../controllers/QuoteController";
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
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
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
                  price: { type: "number" },
                  currency: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    quoteOrderHandler
  );
}
