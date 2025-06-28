import { QuoteHistoryDTO } from "@application/dtos/quote-history.dto";
import { QuoteRepository } from "@application/interfaces/quote-repository.interface";

export class GetQuoteHistoryUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(userId: number): Promise<QuoteHistoryDTO[]> {
    return await this.quoteRepository.getQuoteHistory(userId);
  }
}
