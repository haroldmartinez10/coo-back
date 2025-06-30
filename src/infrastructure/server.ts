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
    origin: true, // Permitir todas las origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "X-HTTP-Method-Override",
    ],
    credentials: false, // Necesario cuando origin es true
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.register(swagger, swaggerOptions);
  await app.register(swaggerUi, swaggerUiOptions);

  return app;
};

export default createServer;
