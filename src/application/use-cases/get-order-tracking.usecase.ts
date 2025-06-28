import { OrderService } from "@application/services/OrderService";
import { OrderTrackingDto } from "@application/dtos/order-status.dto";

export class GetOrderTrackingUseCase {
  constructor(private orderService: OrderService) {}

  async execute(orderId: number, userId: number): Promise<OrderTrackingDto> {
    const orderTracking = await this.orderService.getOrderTracking(orderId);

    if (!orderTracking) {
      throw new Error("Orden no encontrada");
    }

    // Verificar que la orden pertenezca al usuario
    if (orderTracking.userId !== userId) {
      throw new Error("No tienes permisos para ver esta orden");
    }

    return orderTracking;
  }
}
