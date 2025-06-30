import { OrderRepository } from "@application/interfaces/order-repository.interface";
import { QuoteRepository } from "@application/interfaces/quote-repository.interface";
import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";
import {
  OrderTrackingDto,
  OrderStatusDto,
  OrderStatusHistoryDto,
  UpdateOrderStatusDto,
} from "@application/dtos/order-status.dto";

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private quoteRepository?: QuoteRepository
  ) {}

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

    if (this.quoteRepository) {
      await this.validateBasePrice(orderData);
    }

    return await this.orderRepository.createOrder(orderData, userId);
  }

  private async validateBasePrice(orderData: CreateOrderDTO): Promise<void> {
    if (!this.quoteRepository) {
      throw new Error(
        "QuoteRepository no está disponible para validación de precios"
      );
    }

    try {
      const volumeWeight =
        (orderData.height * orderData.width * orderData.length) / 2500;
      const selectedWeight = Math.max(orderData.weight, volumeWeight);

      const expectedBasePrice = await this.quoteRepository.findRate(
        orderData.originCity,
        orderData.destinationCity,
        selectedWeight
      );

      if (expectedBasePrice === null) {
        throw new Error(
          `No se encontró tarifa para la ruta ${orderData.originCity} -> ${orderData.destinationCity} con peso ${selectedWeight}kg (peso real: ${orderData.weight}kg, peso volumétrico: ${volumeWeight}kg)`
        );
      }

      if (orderData.basePrice !== expectedBasePrice) {
        throw new Error(
          `Precio base inválido. Se esperaba ${expectedBasePrice} pero se recibió ${orderData.basePrice} para la ruta ${orderData.originCity} -> ${orderData.destinationCity} con peso ${selectedWeight}kg (peso real: ${orderData.weight}kg, peso volumétrico: ${volumeWeight}kg)`
        );
      }
    } catch (error) {
      throw new Error(
        `Error validando precio base: ${(error as Error).message}`
      );
    }
  }

  async getUserOrders(userId: number): Promise<OrderDTO[]> {
    return await this.orderRepository.findOrdersByUserId(userId);
  }

  async getOrderById(id: number): Promise<OrderDTO | null> {
    return await this.orderRepository.findOrderById(id);
  }

  async getOrderByTrackingCode(trackingCode: string): Promise<OrderDTO | null> {
    return await this.orderRepository.findOrderByTrackingCode(trackingCode);
  }

  async getOrderTracking(id: number): Promise<OrderTrackingDto | null> {
    return await this.orderRepository.findOrderWithTrackingById(id);
  }

  async getOrderTrackingByCode(
    trackingCode: string
  ): Promise<OrderTrackingDto | null> {
    return await this.orderRepository.findOrderWithTrackingByTrackingCode(
      trackingCode
    );
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

  async getOrderStatusHistoryWithDetails(
    orderId: number
  ): Promise<OrderStatusHistoryDto> {
    const existingOrder = await this.orderRepository.findOrderById(orderId);
    if (!existingOrder) {
      throw new Error("Orden no encontrada");
    }

    const statusHistory = await this.orderRepository.getOrderStatusHistory(
      orderId
    );

    return {
      order: existingOrder,
      statusHistory,
    };
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
