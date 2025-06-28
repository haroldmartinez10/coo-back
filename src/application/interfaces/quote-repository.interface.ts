export interface RateRepository {
  findRate(
    origin: string,
    destination: string,
    weight: number
  ): Promise<number | null>;
}
