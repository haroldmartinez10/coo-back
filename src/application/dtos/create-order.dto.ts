export interface CreateOrderDTO {
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  basePrice: number;
}
