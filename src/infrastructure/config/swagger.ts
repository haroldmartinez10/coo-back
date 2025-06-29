export const swaggerOptions = {
  swagger: {
    info: {
      title: "COO API",
      version: "1.0.0",
    },
    host:
      process.env.NODE_ENV === "production" ? "api.coo.com" : "localhost:3000",
    schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      Bearer: {
        type: "apiKey" as const,
        name: "Authorization",
        in: "header" as const,
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"',
      },
    },
    tags: [
      {
        name: "Users",
        description: "Operaciones relacionadas con usuarios",
      },
      {
        name: "Quotes",
        description: "Operaciones relacionadas con cotizaciones",
      },
      {
        name: "Orders",
        description: "Operaciones relacionadas con órdenes de envío",
      },
    ],
  },
};

export const swaggerUiOptions = {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full" as const,
    deepLinking: false,
  },
  staticCSP: true,
};
