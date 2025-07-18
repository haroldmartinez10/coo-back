import "dotenv/config";
import createServer from "@infrastructure/server";
import checkDatabaseService from "@application/services/CheckDatabaseService";
import userRoutes from "interface/routes/userRoutes";
import quoteRoutes from "interface/routes/quoteRoutes";
import orderRoutes from "interface/routes/orderRoutes";

async function startServer() {
  await checkDatabaseService();

  const app = await createServer();

  await app.register(userRoutes, { prefix: "/users" });
  await app.register(quoteRoutes);
  await app.register(orderRoutes);

  const PORT = process.env.PORT || 3000;

  try {
    await app.listen({ port: +PORT, host: "0.0.0.0" });
    console.log(`Server listening on port ${PORT}`);

    const { SocketService } = await import(
      "./infrastructure/websocket/socket.service"
    );
    const socketService = SocketService.getInstance();
    socketService.initialize(app.server);
  } catch (err) {
    process.exit(1);
  }
}

startServer();
