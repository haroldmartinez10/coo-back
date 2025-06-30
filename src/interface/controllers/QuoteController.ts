import { QuoteOrderUseCase } from "@application/use-cases/quote-order.use-case";
import { QuoteRepositoryImpl } from "@infrastructure/repositories/QuoteRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { quoteRequestSchema } from "../validators/quoteValidator";
import { LoginUserUseCase } from "@application/use-cases/login-user.usecase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { JwtService } from "@application/services/JwtService";

export const quoteOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const validation = quoteRequestSchema.safeParse(request.body);

    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        message: "Datos inválidos",
        errors: validation.error.errors,
      });
    }

    const quoteRepository = new QuoteRepositoryImpl();

    const quoteUseCase = new QuoteOrderUseCase(quoteRepository);

    const userId = (request as any).user.userId;

    const quoteCalculation = await quoteUseCase.quoteOrder(
      validation.data,
      userId
    );

    return reply.status(200).send({
      success: true,
      message: "Cotización calculada exitosamente",
      data: {
        originCity: quoteCalculation.originCity,
        destinationCity: quoteCalculation.destinationCity,
        packageDetails: {
          actualWeight: quoteCalculation.actualWeight,
          volumeWeight: quoteCalculation.volumeWeight,
          selectedWeight: quoteCalculation.selectedWeight,
          dimensions: quoteCalculation.dimensions,
        },
        price: quoteCalculation.basePrice,
        currency: "COP",
      },
    });
  } catch (error) {
    console.error("Error calculating quote:", error);

    const errorMessage = (error as Error).message;

    if (errorMessage.includes("no está soportada")) {
      return reply.status(400).send({
        success: false,
        message: errorMessage,
      });
    }

    if (errorMessage.includes("No se encontró tarifa")) {
      return reply.status(404).send({
        success: false,
        message: errorMessage,
      });
    }

    return reply.status(500).send({
      success: false,
      message: "Error al calcular la cotización",
    });
  }
};

export const getQuoteHistoryHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const quoteRepository = new QuoteRepositoryImpl();

    const userId = (request as any).user.userId;

    const quotes = await quoteRepository.getQuoteHistory(userId);

    return reply.status(200).send({
      success: true,
      message: "Historial de cotizaciones obtenido exitosamente",
      data: quotes,
    });
  } catch (error) {
    console.error("Error getting quote history:", error);
    return reply.status(500).send({
      success: false,
      message: "Error al obtener el historial de cotizaciones",
    });
  }
};
