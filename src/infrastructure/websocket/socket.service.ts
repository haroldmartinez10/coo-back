import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import { JwtService } from "@application/services/JwtService";

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;
  private jwtService: JwtService;
  private isDevelopment: boolean;

  private constructor() {
    this.jwtService = new JwtService();
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(server: Server): void {
    if (!this.io) {
      this.io = new SocketIOServer(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
        transports: ["websocket", "polling"],
      });

      this.setupEventHandlers();
    }
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      if (this.isDevelopment) {
        socket.on("test-join-room", (userId: string) => {
          const roomName = `room-state-${userId}`;
          socket.join(roomName);

          socket.emit("test-room-joined", {
            success: true,
            room: roomName,
            message: "Modo desarrollo - Sin autenticación",
            userId: userId,
          });
        });

        socket.on(
          "test-simulate-order-update",
          (data: { userId: string; orderId: string }) => {
            const roomName = `room-state-${data.userId}`;

            const mockOrderData = {
              id: parseInt(data.orderId),
              userId: parseInt(data.userId),
              trackingCode: `COO-TEST-${Date.now()}`,
              status: "in_transit",
              originCity: "Bogotá",
              destinationCity: "Medellín",
              basePrice: 50000,
              weight: 2.5,
              height: 10,
              width: 15,
              length: 20,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            this.io?.to(roomName).emit("order-updated", {
              type: "ORDER_STATUS_UPDATED",
              data: {
                ...mockOrderData,
                timestamp: new Date().toISOString(),
              },
            });

            socket.emit("test-order-sent", {
              success: true,
              message: "Orden simulada enviada",
              roomName,
              orderData: mockOrderData,
            });
          }
        );
      }

      socket.on("authenticate", (token: string) => {
        try {
          const decoded = this.jwtService.verifyToken(token);

          (socket as any).user = decoded;

          const roomName = `room-state-${decoded.userId}`;
          socket.join(roomName);

          socket.emit("authenticated", {
            success: true,
            user: {
              userId: decoded.userId,
              email: decoded.email,
              name: decoded.name,
              role: decoded.role,
            },
            room: roomName,
            message: "Autenticado correctamente",
          });
        } catch (error) {
          socket.emit("authentication-error", {
            success: false,
            message: "Token inválido o expirado",
          });
          socket.disconnect();
        }
      });

      socket.on("join-user-room", () => {
        const user = (socket as any).user;
        if (!user) {
          socket.emit("error", { message: "Debe autenticarse primero" });
          return;
        }

        const roomName = `room-state-${user.userId}`;
        socket.join(roomName);

        socket.emit("room-joined", {
          success: true,
          room: roomName,
          message: "Conectado a notificaciones",
        });
      });

      socket.on("leave-user-room", () => {
        const user = (socket as any).user;
        if (!user) {
          return;
        }

        const roomName = `room-state-${user.userId}`;
        socket.leave(roomName);
      });

      socket.on("disconnect", () => {
        const user = (socket as any).user;
        const userInfo = user
          ? `${user.userId} (${user.email})`
          : "no autenticado";
      });
    });
  }

  public emitOrderUpdate(userId: number, orderData: any): void {
    if (!this.io) {
      return;
    }

    const roomName = `room-state-${userId}`;

    this.io.to(roomName).emit("order-updated", {
      type: "ORDER_STATUS_UPDATED",
      data: {
        ...orderData,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
