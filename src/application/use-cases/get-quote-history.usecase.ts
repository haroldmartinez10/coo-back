import { QuoteHistoryDTO } from "@application/dtos/quote-history.dto";
import { RateRepository } from "@application/interfaces/quote-repository.interface";

export class GetQuoteHistoryUseCase {
  constructor(private rateRepository: RateRepository) {}

  async execute(userId: number): Promise<QuoteHistoryDTO[]> {
    return await this.rateRepository.getQuoteHistory(userId);
  }
}
