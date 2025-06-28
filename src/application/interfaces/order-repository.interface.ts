import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";

export interface OrderRepository {
  createOrder(orderData: CreateOrderDTO, userId: number): Promise<OrderDTO>;
  findOrdersByUserId(userId: number): Promise<OrderDTO[]>;
  findOrderById(id: number): Promise<OrderDTO | null>;
}
