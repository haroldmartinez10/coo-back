export interface QuoteHistoryDTO {
  id: number;
  userId: number;
  originCity: string;
  destinationCity: string;
  actualWeight: number;
  volumeWeight: number;
  selectedWeight: number;
  height: number;
  width: number;
  length: number;
  basePrice: number;

  createdAt: Date;
}

export interface CreateQuoteHistoryDTO {
  userId: number;
  originCity: string;
  destinationCity: string;
  actualWeight: number;
  volumeWeight: number;
  selectedWeight: number;
  height: number;
  width: number;
  length: number;
  basePrice: number;
}
