import { OrderService } from "@application/services/OrderService";
import { OrderStatusDto } from "@application/dtos/order-status.dto";

export class GetOrderStatusHistoryUseCase {
  constructor(private orderService: OrderService) {}

  async execute(orderId: number, userId: number): Promise<OrderStatusDto[]> {
    const order = await this.orderService.getOrderById(orderId);

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    if (order.userId !== userId) {
      throw new Error("No tienes permisos para ver esta orden");
    }

    return await this.orderService.getOrderStatusHistory(orderId);
  }
}
