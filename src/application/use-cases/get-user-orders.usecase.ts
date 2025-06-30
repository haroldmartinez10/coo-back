import { OrderService } from "@application/services/OrderService";
import { OrderDTO } from "@application/dtos/order.dto";

export class GetUserOrdersUseCase {
  constructor(private orderService: OrderService) {}

  async execute(userId: number, isAdmin: boolean = false): Promise<OrderDTO[]> {
    if (isAdmin) {
      return await this.orderService.getAllOrders();
    }
    return await this.orderService.getUserOrders(userId);
  }
}
