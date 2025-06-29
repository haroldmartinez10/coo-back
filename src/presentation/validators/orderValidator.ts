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

export const updateOrderStatusSchema = z.object({
  newStatus: z.enum(["pending", "in_transit", "delivered"], {
    errorMap: () => ({
      message: "Estado inválido. Debe ser: pending, in_transit o delivered",
    }),
  }),
  notes: z.string().optional(),
});

export const orderIdParamSchema = z.object({
  id: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error("ID de orden inválido");
    }
    return num;
  }),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
