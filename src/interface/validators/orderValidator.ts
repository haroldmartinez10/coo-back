import { z } from "zod";

export const createOrderSchema = z.object({
  originCity: z.string().min(1, "Ciudad de origen es requerida"),
  destinationCity: z.string().min(1, "Ciudad de destino es requerida"),
  weight: z.number().positive("El peso debe ser mayor a 0"),
  height: z.number().positive("La altura debe ser mayor a 0"),
  width: z.number().positive("El ancho debe ser mayor a 0"),
  length: z.number().positive("La longitud debe ser mayor a 0"),
  basePrice: z
    .number()
    .int("El precio base debe ser un número entero")
    .positive("El precio base debe ser mayor a 0"),
});

export const updateOrderStatusSchema = z.object({
  newStatus: z.enum(["pending", "in_transit", "delivered"], {
    errorMap: () => ({
      message: "Estado inválido. Debe ser: pending, in_transit o delivered",
    }),
  }),
  notes: z.string().optional(),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;
