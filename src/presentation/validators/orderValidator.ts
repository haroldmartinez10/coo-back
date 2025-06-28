import { z } from "zod";

export const createOrderSchema = z.object({
  originCity: z.string().min(1, "Ciudad de origen es requerida"),
  destinationCity: z.string().min(1, "Ciudad de destino es requerida"),
  weight: z.number().positive("El peso debe ser mayor a 0"),
  height: z.number().positive("La altura debe ser mayor a 0"),
  width: z.number().positive("El ancho debe ser mayor a 0"),
  length: z.number().positive("La longitud debe ser mayor a 0"),
  totalPrice: z.number().positive("El precio total debe ser mayor a 0"),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
