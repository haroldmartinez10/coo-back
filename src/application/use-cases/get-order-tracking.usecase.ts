import { OrderService } from "@application/services/OrderService";
import { OrderTrackingDto } from "@application/dtos/order-status.dto";

export class GetOrderTrackingUseCase {
  constructor(private orderService: OrderService) {}

  async execute(
    orderId: number,
    userId: number,
    userRole: string = "user"
  ): Promise<OrderTrackingDto> {
    const orderTracking = await this.orderService.getOrderTracking(orderId);

    if (!orderTracking) {
      throw new Error("Orden no encontrada");
    }

    const isOwner = orderTracking.userId === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("No tienes permisos para ver esta orden");
    }

    return orderTracking;
  }
}
