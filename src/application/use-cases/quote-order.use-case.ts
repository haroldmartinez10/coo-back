import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";
import { RateRepository } from "@application/interfaces/quote-repository.interface";
import {
  QuoteService,
  QuoteCalculation,
} from "@application/services/QuoteService";

export class QuoteOrderUseCase {
  private quoteService: QuoteService;

  constructor(private rateRepo: RateRepository) {
    this.quoteService = new QuoteService(rateRepo);
  }

  async execute(dto: QuoteOrderDTO, userId: number): Promise<QuoteCalculation> {
    return await this.quoteService.calculateAndSaveQuote(dto, userId);
  }
}
