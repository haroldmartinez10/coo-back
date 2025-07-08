export interface RateDetails {
  basePrice: number;
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
}
