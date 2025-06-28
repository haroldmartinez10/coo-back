import { OrderService } from "@application/services/OrderService";
import { UpdateOrderStatusDto } from "@application/dtos/order-status.dto";

export class UpdateOrderStatusUseCase {
  constructor(private orderService: OrderService) {}

  async execute(updateData: UpdateOrderStatusDto): Promise<void> {
    await this.orderService.updateOrderStatus(updateData);
  }
}
