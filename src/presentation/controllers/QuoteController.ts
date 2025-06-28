import { QuoteOrderUseCase } from "@application/use-cases/quote-order.use-case";
import { RateRepositoryImpl } from "@infrastructure/repositories/RateRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateQuoteRequest } from "../validators/quoteValidator";

export const quoteOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const validation = validateQuoteRequest(request.body);

    if (!validation.isValid) {
      return reply.code(400).send({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const rateRepository = new RateRepositoryImpl();
    const quoteUseCase = new QuoteOrderUseCase(rateRepository);

    const quoteCalculation = await quoteUseCase.execute(
      validation.validatedData!
    );

    reply.code(200).send({
      message: "Quote calculated successfully",
      quote: {
        originCity: quoteCalculation.originCity,
        destinationCity: quoteCalculation.destinationCity,
        packageDetails: {
          actualWeight: quoteCalculation.actualWeight,
          volumeWeight: quoteCalculation.volumeWeight,
          selectedWeight: quoteCalculation.selectedWeight,
          dimensions: quoteCalculation.dimensions,
        },
        pricing: {
          basePrice: quoteCalculation.basePrice,
          pricePerKg: quoteCalculation.pricePerKg,
          totalPrice: quoteCalculation.totalPrice,
        },
        currency: "COP",
      },
    });
  } catch (error) {
    console.error("Error calculating quote:", error);

    const errorMessage = (error as Error).message;

    if (errorMessage.includes("not supported")) {
      return reply.code(400).send({
        error: "Unsupported city",
        message: errorMessage,
      });
    }

    if (errorMessage.includes("No rate found")) {
      return reply.code(404).send({
        error: "No rate found for the selected route and weight",
        message: errorMessage,
      });
    }

    reply.code(500).send({
      error: "Internal server error while calculating quote",
    });
  }
};
