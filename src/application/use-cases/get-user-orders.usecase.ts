import { OrderService } from "@application/services/OrderService";
import { OrderDTO } from "@application/dtos/order.dto";

export class GetUserOrdersUseCase {
  constructor(private orderService: OrderService) {}

  async execute(userId: number): Promise<OrderDTO[]> {
    return await this.orderService.getUserOrders(userId);
  }
}
