import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserOrdersUseCase } from "@application/use-cases/get-user-orders.usecase";
import { GetOrderTrackingUseCase } from "@application/use-cases/get-order-tracking.usecase";
import { GetOrderTrackingByCodeUseCase } from "@application/use-cases/get-order-tracking-by-code.usecase";
import { GetOrderStatusHistoryUseCase } from "@application/use-cases/get-order-status-history.usecase";
import { OrderRepositoryImpl } from "@infrastructure/repositories/OrderRepository";
import { QuoteRepositoryImpl } from "@infrastructure/repositories/QuoteRepository";
import { OrderService } from "@application/services/OrderService";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/orderValidator";

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
    const quoteRepository = new QuoteRepositoryImpl();
    const orderService = new OrderService(orderRepository, quoteRepository);

    const order = await orderService.createOrder(orderData, userId);

    return reply.status(201).send({
      success: true,
      message: "Orden de envío creada exitosamente",
      data: order,
    });
  } catch (error) {
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
    const userRole = (request as any).user.role;
    const isAdmin = userRole === "admin";

    const orderRepository = new OrderRepositoryImpl();
    const orderService = new OrderService(orderRepository);

    const getUserOrdersUseCase = new GetUserOrdersUseCase(orderService);

    const orders = await getUserOrdersUseCase.getUserOrders(userId, isAdmin);

    const message = isAdmin
      ? "Todas las órdenes obtenidas exitosamente"
      : "Órdenes obtenidas exitosamente";

    return reply.status(200).send({
      success: true,
      message,
      data: orders,
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: "Error al obtener las órdenes",
    });
  }
};

export const getOrderTrackingHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const orderId = Number(id);
    const userId = (request as any).user.userId;
    const userRole = (request as any).user.role;

    const orderRepository = new OrderRepositoryImpl();
    const orderService = new OrderService(orderRepository);

    const getOrderTrackingUseCase = new GetOrderTrackingUseCase(orderService);

    const orderTracking = await getOrderTrackingUseCase.getOrderTracking(
      orderId,
      userId,
      userRole
    );

    return reply.status(200).send({
      success: true,
      message: "Seguimiento de orden obtenido exitosamente",
      data: orderTracking,
    });
  } catch (error) {
    const status =
      error instanceof Error && error.message.includes("permisos")
        ? 403
        : error instanceof Error && error.message.includes("no encontrada")
        ? 404
        : 500;

    return reply.status(status).send({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener el seguimiento",
    });
  }
};

export const updateOrderStatusHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const orderId = Number(id);

    const bodyValidation = updateOrderStatusSchema.safeParse(request.body);
    if (!bodyValidation.success) {
      return reply.status(400).send({
        success: false,
        message: "Datos inválidos",
        errors: bodyValidation.error.errors,
      });
    }
    const { newStatus, notes } = bodyValidation.data;

    const orderRepository = new OrderRepositoryImpl();
    const orderService = new OrderService(orderRepository);

    await orderService.updateOrderStatus({
      orderId,
      newStatus,
      notes,
    });

    return reply.status(200).send({
      success: true,
      message: "Estado de la orden actualizado exitosamente",
    });
  } catch (error) {
    const status =
      error instanceof Error && error.message.includes("no encontrada")
        ? 404
        : (error instanceof Error && error.message.includes("inválida")) ||
          (error instanceof Error && error.message.includes("inválido"))
        ? 400
        : 500;

    return reply.status(status).send({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado",
    });
  }
};

export const getOrderStatusHistoryHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const orderId = Number(id);
    const userId = (request as any).user.userId;
    const userRole = (request as any).user.role;

    const orderRepository = new OrderRepositoryImpl();

    const orderService = new OrderService(orderRepository);

    const getOrderStatusHistoryUseCase = new GetOrderStatusHistoryUseCase(
      orderService
    );

    const statusHistory =
      await getOrderStatusHistoryUseCase.getOrderStatusHistory(
        orderId,
        userId,
        userRole
      );

    return reply.status(200).send({
      success: true,
      message: "Historial de estados obtenido exitosamente",
      data: statusHistory,
    });
  } catch (error) {
    const status =
      error instanceof Error && error.message.includes("permisos")
        ? 403
        : error instanceof Error && error.message.includes("no encontrada")
        ? 404
        : 500;

    return reply.status(status).send({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener el historial",
    });
  }
};

export const getOrderTrackingByCodeHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { trackingCode } = request.params as { trackingCode: string };

    if (
      !trackingCode ||
      typeof trackingCode !== "string" ||
      trackingCode.trim().length === 0
    ) {
      return reply.status(400).send({
        success: false,
        message: "Código de seguimiento es requerido",
      });
    }

    const orderRepository = new OrderRepositoryImpl();
    const orderService = new OrderService(orderRepository);
    const getOrderTrackingByCodeUseCase = new GetOrderTrackingByCodeUseCase(
      orderService
    );

    const orderTracking =
      await getOrderTrackingByCodeUseCase.getOrderTrackingByCode(
        trackingCode.trim().toUpperCase()
      );

    const publicTrackingData = {
      id: orderTracking.id,
      originCity: orderTracking.originCity,
      destinationCity: orderTracking.destinationCity,
      weight: orderTracking.weight,
      height: orderTracking.height,
      width: orderTracking.width,
      length: orderTracking.length,
      basePrice: orderTracking.basePrice,
      trackingCode: orderTracking.trackingCode,
      status: orderTracking.status,
      createdAt: orderTracking.createdAt,
      updatedAt: orderTracking.updatedAt,
      statusHistory: orderTracking.statusHistory,
    };

    return reply.status(200).send({
      success: true,
      message: "Seguimiento de orden obtenido exitosamente",
      data: publicTrackingData,
    });
  } catch (error) {
    const status =
      error instanceof Error && error.message.includes("no encontrada")
        ? 404
        : 500;

    return reply.status(status).send({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener el seguimiento",
    });
  }
};
