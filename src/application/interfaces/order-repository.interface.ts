import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";
import {
  OrderTrackingDto,
  OrderStatusDto,
  UpdateOrderStatusDto,
} from "@application/dtos/order-status.dto";

export interface OrderRepository {
  createOrder(orderData: CreateOrderDTO, userId: number): Promise<OrderDTO>;
  findOrdersByUserId(userId: number): Promise<OrderDTO[]>;
  findOrderById(id: number): Promise<OrderDTO | null>;
  findOrderByTrackingCode(trackingCode: string): Promise<OrderDTO | null>;
  findOrderWithTrackingById(id: number): Promise<OrderTrackingDto | null>;
  findOrderWithTrackingByTrackingCode(
    trackingCode: string
  ): Promise<OrderTrackingDto | null>;
  updateOrderStatus(updateData: UpdateOrderStatusDto): Promise<void>;
  getOrderStatusHistory(orderId: number): Promise<OrderStatusDto[]>;
  addStatusToHistory(
    orderId: number,
    status: string,
    notes?: string
  ): Promise<void>;
}
