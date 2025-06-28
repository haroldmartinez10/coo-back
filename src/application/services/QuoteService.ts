import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";
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

  /**
   * Calcula el peso volumen según la fórmula: (alto * ancho * largo) / 2500
   * Redondea hacia arriba al valor entero superior
   */
  calculateVolumeWeight(height: number, width: number, length: number): number {
    return Math.ceil((height * width * length) / 2500);
  }

  /**
   *Este Determina el peso a usar para cotización, es decir mayor entre peso físico y volumen
   */
  calculateSelectedWeight(actualWeight: number, volumeWeight: number): number {
    return Math.max(actualWeight, volumeWeight);
  }

  /**
   * Valida que las ciudades estén soportadas en el sistema
   */
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

  /**
   * Realiza la cotización completa del envío
   */
  async calculateQuote(dto: QuoteOrderDTO): Promise<QuoteCalculation> {
    // Validar ciudades soportadas
    this.validateSupportedCities(dto.originCity, dto.destinationCity);

    // Calcular pesos
    const volumeWeight = this.calculateVolumeWeight(
      dto.height,
      dto.width,
      dto.length
    );
    const selectedWeight = this.calculateSelectedWeight(
      dto.weight,
      volumeWeight
    );

    // Obtener tarifa de la base de datos
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

    // Calcular precio total
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

  getSupportedCities(): string[] {
    return ["Bogotá", "Medellín", "Cali", "Barranquilla"];
  }
}
