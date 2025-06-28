import { FastifyReply, FastifyRequest } from "fastify";
import { CreateOrderUseCase } from "@application/use-cases/create-order.usecase";
import { GetUserOrdersUseCase } from "@application/use-cases/get-user-orders.usecase";
import { OrderRepositoryImpl } from "@infrastructure/repositories/OrderRepository";
import { OrderService } from "@application/services/OrderService";
import { createOrderSchema } from "../validators/orderValidator";

export const createOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const validation = createOrderSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        message: "Datos inválidos",
        errors: validation.error.errors,
      });
    }

    const orderData = validation.data;
    const userId = (request as any).user.userId;

    const orderRepository = new OrderRepositoryImpl();
    const orderService = new OrderService(orderRepository);
    const createOrderUseCase = new CreateOrderUseCase(orderService);

    const order = await createOrderUseCase.execute(orderData, userId);

    return reply.status(201).send({
      success: true,
      message: "Orden de envío creada exitosamente",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return reply.status(400).send({
      success: false,
      message:
        error instanceof Error ? error.message : "Error al crear la orden",
    });
  }
};

export const getUserOrdersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = (request as any).user.userId;

    const orderRepository = new OrderRepositoryImpl();
    const orderService = new OrderService(orderRepository);
    const getUserOrdersUseCase = new GetUserOrdersUseCase(orderService);

    const orders = await getUserOrdersUseCase.execute(userId);

    return reply.status(200).send({
      success: true,
      message: "Órdenes obtenidas exitosamente",
      data: orders,
    });
  } catch (error) {
    console.error("Error getting user orders:", error);
    return reply.status(500).send({
      success: false,
      message: "Error al obtener las órdenes",
    });
  }
};
