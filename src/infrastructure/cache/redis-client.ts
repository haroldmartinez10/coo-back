import { createClient, RedisClientType } from "redis";
import { env } from "../config/env";
import { OrderDTO } from "@application/dtos/order.dto";

class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType | null = null;
  private isConnected = false;
  private connectionAttempted = false;

  private constructor() {}

  private async ensureConnection() {
    if (this.connectionAttempted) {
      return this.isConnected;
    }

    this.connectionAttempted = true;

    try {
      this.client = createClient({
        url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
        password: env.REDIS_PASSWORD || undefined,
      });

      this.client.on("connect", () => {
        this.isConnected = true;
      });

      this.client.on("error", (error: Error) => {
        this.isConnected = false;
      });

      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("TIMEOUT")), 5000);
      });

      await Promise.race([connectPromise, timeoutPromise]);

      return this.isConnected;
    } catch (error) {
      console.error("❌ Error conectando a Redis:", error);
      this.isConnected = false;
      return false;
    }
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async getUserOrdersFromCache(userId: number): Promise<OrderDTO[] | null> {
    const connected = await this.ensureConnection();
    if (!connected || !this.client) {
      return null;
    }

    try {
      const key = `user_orders:${userId}`;

      const cached = await this.client.get(key);

      if (cached) {
        return JSON.parse(cached);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async saveUserOrdersToCache(
    userId: number,
    orders: OrderDTO[]
  ): Promise<void> {
    const connected = await this.ensureConnection();
    if (!connected || !this.client) {
      return;
    }

    try {
      const key = `user_orders:${userId}`;
      const value = JSON.stringify(orders);

      await this.client.setEx(key, 300, value); // Aumentado a 5 minutos
    } catch (error) {
      error;
    }
  }

  async invalidateUserOrders(userId: number): Promise<void> {
    const connected = await this.ensureConnection();
    if (!connected || !this.client) {
      return;
    }

    try {
      const key = `user_orders:${userId}`;
      await this.client.del(key);
    } catch (error) {
      error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

export const redisClient = RedisClient.getInstance();
