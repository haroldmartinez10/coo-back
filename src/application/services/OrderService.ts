import { OrderRepository } from "@application/interfaces/order-repository.interface";
import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async createOrder(
    orderData: CreateOrderDTO,
    userId: number
  ): Promise<OrderDTO> {
    if (orderData.weight <= 0) {
      throw new Error("El peso debe ser mayor a 0");
    }

    if (
      orderData.height <= 0 ||
      orderData.width <= 0 ||
      orderData.length <= 0
    ) {
      throw new Error("Las dimensiones deben ser mayores a 0");
    }

    if (orderData.totalPrice <= 0) {
      throw new Error("El precio total debe ser mayor a 0");
    }

    if (!orderData.originCity || !orderData.destinationCity) {
      throw new Error("Debe especificar ciudad de origen y destino");
    }

    return await this.orderRepository.createOrder(orderData, userId);
  }

  async getUserOrders(userId: number): Promise<OrderDTO[]> {
    return await this.orderRepository.findOrdersByUserId(userId);
  }

  async getOrderById(id: number): Promise<OrderDTO | null> {
    return await this.orderRepository.findOrderById(id);
  }
}
