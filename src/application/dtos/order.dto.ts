export interface OrderDTO {
  id: number;
  userId: number;
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
