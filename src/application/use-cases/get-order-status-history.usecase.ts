import { OrderService } from "@application/services/OrderService";
import { OrderStatusHistoryDto } from "@application/dtos/order-status.dto";

export class GetOrderStatusHistoryUseCase {
  constructor(private orderService: OrderService) {}

  async getOrderStatusHistory(
    orderId: number,
    userId: number,
    userRole: string = "user"
  ): Promise<OrderStatusHistoryDto> {
    const orderStatusHistory =
      await this.orderService.getOrderStatusHistoryWithDetails(orderId);

    const isOwner = orderStatusHistory.order.userId === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("No tienes permisos para ver esta orden");
    }

    return orderStatusHistory;
  }
}
