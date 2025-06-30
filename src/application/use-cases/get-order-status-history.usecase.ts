import { OrderService } from "@application/services/OrderService";
import { OrderStatusHistoryDto } from "@application/dtos/order-status.dto";

export class GetOrderStatusHistoryUseCase {
  constructor(private orderService: OrderService) {}

  async execute(
    orderId: number,
    userId: number
  ): Promise<OrderStatusHistoryDto> {
    const orderStatusHistory =
      await this.orderService.getOrderStatusHistoryWithDetails(orderId);

    if (orderStatusHistory.order.userId !== userId) {
      throw new Error("No tienes permisos para ver esta orden");
    }

    return orderStatusHistory;
  }
}
