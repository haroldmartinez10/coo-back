import { FastifyInstance } from "fastify";
import {
  quoteOrderHandler,
  getQuoteHistoryHandler,
} from "../controllers/QuoteController";
import { authMiddleware } from "../middleware/authMiddleware";

export default async function quoteRoutes(fastify: FastifyInstance) {
  // POST /quotes - Calculate shipping quote (requires authentication)
  fastify.post(
    "/quotes",
    {
      preHandler: authMiddleware,
    },
    quoteOrderHandler
  );

  // GET /quotes - Get user's quote history (requires authentication)
  fastify.get(
    "/quotes",
    {
      preHandler: authMiddleware,
    },
    getQuoteHistoryHandler
  );
}
