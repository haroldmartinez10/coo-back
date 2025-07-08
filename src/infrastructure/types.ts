import { RedisClientType } from "redis";
import { Socket } from "socket.io";
import { AuthenticatedUser } from "@application/dtos/user.dto";
import { OrderDTO } from "@application/dtos/order.dto";

export type RedisClient = RedisClientType;

export interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUser;
}

export interface OrderUpdateData {
  id: number;
  trackingCode: string;
  status: string;
  [key: string]: unknown;
}

export type OrderUpdateDataInput = OrderDTO | OrderUpdateData;
