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
import { redisClient } from "@infrastructure/cache/redis-client";

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private quoteRepository?: QuoteRepository
  ) {}

  async createOrder(
    orderData: CreateOrderDTO,
    userId: number
  ): Promise<OrderDTO> {
    if (this.quoteRepository) {
      await this.validateBasePrice(orderData);
    }

    const order = await this.orderRepository.createOrder(orderData, userId);

    try {
      await redisClient.invalidateUserOrders(userId);
    } catch (error) {
      // Redis errors are handled silently
    }

    return order;
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
    try {
      const cached = await redisClient.getUserOrdersFromCache(userId);
      if (cached) {
        return cached;
      }
    } catch (error) {
      // Redis errors are handled silently, continue with database query
    }

    const orders = await this.orderRepository.findOrdersByUserId(userId);

    try {
      await redisClient.saveUserOrdersToCache(userId, orders);
    } catch (error) {
      // Redis save errors are handled silently
    }

    return orders;
  }

  async getAllOrders(): Promise<OrderDTO[]> {
    return await this.orderRepository.findAllOrders();
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
    const existingOrder = await this.orderRepository.findOrderById(
      updateData.orderId
    );
    if (!existingOrder) {
      throw new Error("Orden no encontrada");
    }

    await this.orderRepository.updateOrderStatus(updateData);

    try {
      await redisClient.invalidateUserOrders(existingOrder.userId);
    } catch (error) {
      // Redis errors are handled silently
    }
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
}
