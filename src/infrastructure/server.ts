import Fastify from "fastify";
import cors from "@fastify/cors";

const createServer = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: "*",
  });

  return app;
};

export default createServer;
