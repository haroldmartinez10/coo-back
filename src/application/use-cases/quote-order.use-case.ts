import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";
import { RateRepository } from "@application/interfaces/quote-repository.interface";

export class QuoteOrderUseCase {
  constructor(private rateRepo: RateRepository) {}

  async execute(dto: QuoteOrderDTO): Promise<number> {
    const volumeWeight = Math.ceil(
      (dto.height * dto.width * dto.length) / 2500
    );
    const selectedWeight = Math.max(dto.weight, volumeWeight);

    const rate = await this.rateRepo.findRate(
      dto.originCity,
      dto.destinationCity,
      selectedWeight
    );

    if (!rate)
      throw new Error("No rate found for the selected route and weight.");

    return rate;
  }
}
