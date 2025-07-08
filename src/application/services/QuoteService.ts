import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";
import { CreateQuoteHistoryDTO } from "@application/dtos/quote-history.dto";
import { QuoteRepository } from "@application/interfaces/quote-repository.interface";
import {
  SUPPORTED_CITIES,
  VOLUME_WEIGHT_CONSTANT,
} from "@shared/constants/volumeWeight";

export interface QuoteCalculation {
  actualWeight: number;
  volumeWeight: number;
  selectedWeight: number;
  basePrice: number;

  originCity: string;
  destinationCity: string;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
}

export class QuoteService {
  constructor(private quoteRepository: QuoteRepository) {}

  calculateVolumeWeight(height: number, width: number, length: number): number {
    return (height * width * length) / VOLUME_WEIGHT_CONSTANT;
  }

  calculateSelectedWeight(actualWeight: number, volumeWeight: number): number {
    return Math.max(actualWeight, volumeWeight);
  }

  validateSupportedCities(originCity: string, destinationCity: string): void {
    if (!SUPPORTED_CITIES.includes(originCity)) {
      throw new Error(
        `La ciudad de origen '${originCity}' no está soportada. Ciudades soportadas: ${SUPPORTED_CITIES.join(
          ", "
        )}`
      );
    }

    if (!SUPPORTED_CITIES.includes(destinationCity)) {
      throw new Error(
        `La ciudad de destino '${destinationCity}' no está soportada. Ciudades soportadas: ${SUPPORTED_CITIES.join(
          ", "
        )}`
      );
    }
  }

  async calculateAndSaveQuote(dto: QuoteOrderDTO): Promise<QuoteCalculation> {
    const quoteCalculation = await this.calculateQuote(dto);

    return quoteCalculation;
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

    const rateData = await this.quoteRepository.findRateDetails(
      dto.originCity,
      dto.destinationCity,
      selectedWeight
    );

    if (!rateData) {
      throw new Error(
        `No se encontró tarifa para la ruta ${dto.originCity} -> ${dto.destinationCity} con peso ${selectedWeight}kg`
      );
    }

    return {
      actualWeight: dto.weight,
      volumeWeight,
      selectedWeight,
      basePrice: rateData.basePrice,

      originCity: dto.originCity,
      destinationCity: dto.destinationCity,
      dimensions: {
        height: dto.height,
        width: dto.width,
        length: dto.length,
      },
    };
  }
}
