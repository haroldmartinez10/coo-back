import { QuoteOrderUseCase } from "@application/use-cases/quote-order.use-case";
import { RateRepositoryImpl } from "@infrastructure/repositories/RateRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateQuoteRequest } from "../validators/quoteValidator";

export const quoteOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Validate request data
    const validation = validateQuoteRequest(request.body);

    if (!validation.isValid) {
      return reply.code(400).send({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    // Initialize dependencies
    const rateRepository = new RateRepositoryImpl();
    const quoteUseCase = new QuoteOrderUseCase(rateRepository);

    // Execute use case
    const price = await quoteUseCase.execute(validation.validatedData!);

    // Calculate additional info for response
    const volumeWeight = Math.ceil(
      (validation.validatedData!.height *
        validation.validatedData!.width *
        validation.validatedData!.length) /
        2500
    );
    const selectedWeight = Math.max(
      validation.validatedData!.weight,
      volumeWeight
    );

    reply.code(200).send({
      message: "Quote calculated successfully",
      quote: {
        originCity: validation.validatedData!.originCity,
        destinationCity: validation.validatedData!.destinationCity,
        packageDetails: {
          actualWeight: validation.validatedData!.weight,
          volumeWeight: volumeWeight,
          selectedWeight: selectedWeight,
          dimensions: {
            height: validation.validatedData!.height,
            width: validation.validatedData!.width,
            length: validation.validatedData!.length,
          },
        },
        price: price,
        currency: "COP", // Assuming Colombian Pesos
      },
    });
  } catch (error) {
    console.error("Error calculating quote:", error);

    if ((error as Error).message.includes("No rate found")) {
      return reply.code(404).send({
        error: "No rate found for the selected route and weight",
      });
    }

    reply.code(500).send({
      error: "Internal server error while calculating quote",
    });
  }
};
