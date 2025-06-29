import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { swaggerOptions, swaggerUiOptions } from "./config/swagger";

const createServer = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: "*",
  });

  await app.register(swagger, swaggerOptions);
  await app.register(swaggerUi, swaggerUiOptions);

  return app;
};

export default createServer;
