import { OrderService } from "@application/services/OrderService";
import { OrderTrackingDto } from "@application/dtos/order-status.dto";

export class GetOrderTrackingByCodeUseCase {
  constructor(private orderService: OrderService) {}

  async getOrderTrackingByCode(
    trackingCode: string
  ): Promise<OrderTrackingDto> {
    const orderTracking = await this.orderService.getOrderTrackingByCode(
      trackingCode
    );

    if (!orderTracking) {
      throw new Error(
        "Orden no encontrada con el código de seguimiento proporcionado"
      );
    }

    return orderTracking;
  }
}
