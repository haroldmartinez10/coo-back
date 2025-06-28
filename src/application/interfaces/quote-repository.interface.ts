import {
  QuoteHistoryDTO,
  CreateQuoteHistoryDTO,
} from "@application/dtos/quote-history.dto";

export interface RateDetails {
  basePrice: number;
  pricePerKg: number;
}

export interface QuoteRepository {
  findRate(
    origin: string,
    destination: string,
    weight: number
  ): Promise<number | null>;

  findRateDetails(
    origin: string,
    destination: string,
    weight: number
  ): Promise<RateDetails | null>;

  saveQuoteHistory(quoteData: CreateQuoteHistoryDTO): Promise<QuoteHistoryDTO>;

  getQuoteHistory(userId: number): Promise<QuoteHistoryDTO[]>;
}
