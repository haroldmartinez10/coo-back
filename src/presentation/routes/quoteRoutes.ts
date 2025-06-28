import { FastifyInstance } from "fastify";
import { quoteOrderHandler } from "../controllers/QuoteController";
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
}
