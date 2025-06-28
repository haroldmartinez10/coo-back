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
    },
    quoteOrderHandler
  );

  fastify.get(
    "/quotes",
    {
      preHandler: authMiddleware,
    },
    getQuoteHistoryHandler
  );
}
