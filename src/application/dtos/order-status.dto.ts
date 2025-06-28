export interface OrderStatusDto {
  id: number;
  status: string;
  changed_at: Date;
  notes?: string;
}

export interface OrderTrackingDto {
  id: number;
  userId: number;
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: OrderStatusDto[];
}

export interface UpdateOrderStatusDto {
  orderId: number;
  newStatus: "En espera" | "En tránsito" | "Entregado";
  notes?: string;
}
