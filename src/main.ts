import "dotenv/config";
import createServer from "@infrastructure/server";
import checkDatabaseService from "@application/services/CheckDatabaseService";
import userRoutes from "presentation/routes/userRoutes";
import quoteRoutes from "presentation/routes/quoteRoutes";

async function startServer() {
  await checkDatabaseService();

  const app = await createServer();

  await app.register(userRoutes, { prefix: "/users" });
  await app.register(quoteRoutes, { prefix: "/api" });

  const PORT = process.env.PORT || 3000;

  try {
    await app.listen({ port: +PORT, host: "0.0.0.0" });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
