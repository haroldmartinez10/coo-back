import { OrderService } from "@application/services/OrderService";
import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";

export class CreateOrderUseCase {
  constructor(private orderService: OrderService) {}

  async execute(orderData: CreateOrderDTO, userId: number): Promise<OrderDTO> {
    return await this.orderService.createOrder(orderData, userId);
  }
}
