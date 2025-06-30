import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";
import { QuoteRepository } from "@application/interfaces/quote-repository.interface";
import {
  QuoteService,
  QuoteCalculation,
} from "@application/services/QuoteService";

export class QuoteOrderUseCase {
  private quoteService: QuoteService;

  constructor(private quoteRepo: QuoteRepository) {
    this.quoteService = new QuoteService(quoteRepo);
  }

  async quoteOrder(
    dto: QuoteOrderDTO,
    userId: number
  ): Promise<QuoteCalculation> {
    return await this.quoteService.calculateAndSaveQuote(dto, userId);
  }
}
