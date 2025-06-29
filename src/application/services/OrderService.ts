import { OrderRepository } from "@application/interfaces/order-repository.interface";
import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";
import {
  OrderTrackingDto,
  OrderStatusDto,
  UpdateOrderStatusDto,
} from "@application/dtos/order-status.dto";

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

  async getOrderTracking(id: number): Promise<OrderTrackingDto | null> {
    return await this.orderRepository.findOrderWithTrackingById(id);
  }

  async updateOrderStatus(updateData: UpdateOrderStatusDto): Promise<void> {
    const validStatuses = ["pending", "in_transit", "delivered"];
    if (!validStatuses.includes(updateData.newStatus)) {
      throw new Error(
        `Estado inválido. Debe ser uno de: ${validStatuses.join(", ")}`
      );
    }

    const existingOrder = await this.orderRepository.findOrderById(
      updateData.orderId
    );
    if (!existingOrder) {
      throw new Error("Orden no encontrada");
    }

    this.validateStatusTransition(existingOrder.status, updateData.newStatus);

    await this.orderRepository.updateOrderStatus(updateData);
  }

  async getOrderStatusHistory(orderId: number): Promise<OrderStatusDto[]> {
    const existingOrder = await this.orderRepository.findOrderById(orderId);
    if (!existingOrder) {
      throw new Error("Orden no encontrada");
    }

    return await this.orderRepository.getOrderStatusHistory(orderId);
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: string
  ): void {
    const statusFlow: Record<string, string[]> = {
      pending: ["in_transit"],
      in_transit: ["delivered"],
      delivered: [],
    };

    const allowedTransitions = statusFlow[currentStatus];

    if (!allowedTransitions) {
      throw new Error(`Estado actual desconocido: ${currentStatus}`);
    }

    if (allowedTransitions.length === 0) {
      throw new Error(
        `No se puede cambiar el estado de una orden que ya está ${currentStatus}`
      );
    }

    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Transición de estado inválida: de '${currentStatus}' a '${newStatus}'. Estados permitidos: ${allowedTransitions.join(
          ", "
        )}`
      );
    }
  }
}
