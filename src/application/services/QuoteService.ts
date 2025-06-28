import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";
import { CreateQuoteHistoryDTO } from "@application/dtos/quote-history.dto";
import { RateRepository } from "@application/interfaces/quote-repository.interface";

export interface QuoteCalculation {
  actualWeight: number;
  volumeWeight: number;
  selectedWeight: number;
  basePrice: number;
  pricePerKg: number;
  totalPrice: number;
  originCity: string;
  destinationCity: string;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
}

export class QuoteService {
  constructor(private rateRepository: RateRepository) {}

  calculateVolumeWeight(height: number, width: number, length: number): number {
    return Math.ceil((height * width * length) / 2500);
  }

  calculateSelectedWeight(actualWeight: number, volumeWeight: number): number {
    return Math.max(actualWeight, volumeWeight);
  }

  validateSupportedCities(originCity: string, destinationCity: string): void {
    const supportedCities = ["Bogotá", "Medellín", "Cali", "Barranquilla"];

    if (!supportedCities.includes(originCity)) {
      throw new Error(
        `Origin city '${originCity}' is not supported. Supported cities: ${supportedCities.join(
          ", "
        )}`
      );
    }

    if (!supportedCities.includes(destinationCity)) {
      throw new Error(
        `Destination city '${destinationCity}' is not supported. Supported cities: ${supportedCities.join(
          ", "
        )}`
      );
    }
  }

  async calculateQuote(dto: QuoteOrderDTO): Promise<QuoteCalculation> {
    this.validateSupportedCities(dto.originCity, dto.destinationCity);

    const volumeWeight = this.calculateVolumeWeight(
      dto.height,
      dto.width,
      dto.length
    );
    const selectedWeight = this.calculateSelectedWeight(
      dto.weight,
      volumeWeight
    );

    const rateData = await this.rateRepository.findRateDetails(
      dto.originCity,
      dto.destinationCity,
      selectedWeight
    );

    if (!rateData) {
      throw new Error(
        `No rate found for route ${dto.originCity} -> ${dto.destinationCity} with weight ${selectedWeight}kg`
      );
    }

    const totalPrice =
      rateData.basePrice + selectedWeight * rateData.pricePerKg;

    return {
      actualWeight: dto.weight,
      volumeWeight,
      selectedWeight,
      basePrice: rateData.basePrice,
      pricePerKg: rateData.pricePerKg,
      totalPrice,
      originCity: dto.originCity,
      destinationCity: dto.destinationCity,
      dimensions: {
        height: dto.height,
        width: dto.width,
        length: dto.length,
      },
    };
  }

  async calculateAndSaveQuote(
    dto: QuoteOrderDTO,
    userId: number
  ): Promise<QuoteCalculation> {
    const quoteCalculation = await this.calculateQuote(dto);

    const historyData: CreateQuoteHistoryDTO = {
      userId,
      originCity: quoteCalculation.originCity,
      destinationCity: quoteCalculation.destinationCity,
      actualWeight: quoteCalculation.actualWeight,
      volumeWeight: quoteCalculation.volumeWeight,
      selectedWeight: quoteCalculation.selectedWeight,
      height: quoteCalculation.dimensions.height,
      width: quoteCalculation.dimensions.width,
      length: quoteCalculation.dimensions.length,
      basePrice: quoteCalculation.basePrice,
      pricePerKg: quoteCalculation.pricePerKg,
      totalPrice: quoteCalculation.totalPrice,
    };

    await this.rateRepository.saveQuoteHistory(historyData);

    return quoteCalculation;
  }

  getSupportedCities(): string[] {
    return ["Bogotá", "Medellín", "Cali", "Barranquilla"];
  }
}
