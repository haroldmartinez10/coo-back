export interface RateDetails {
  basePrice: number;
  pricePerKg: number;
}

export interface RateRepository {
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
