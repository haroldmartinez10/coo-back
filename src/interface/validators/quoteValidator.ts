import { z } from "zod";
import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";

const SUPPORTED_CITIES = ["Bogotá", "Medellín", "Cali", "Barranquilla"];
const MAX_WEIGHT = 1000;
const MIN_DIMENSION = 1;
const MAX_DIMENSION = 300;

export const quoteRequestSchema = z
  .object({
    originCity: z
      .string()
      .min(1, "Ciudad de origen es requerida")
      .trim()
      .refine((city) => SUPPORTED_CITIES.includes(city), {
        message: `Ciudad de origen debe ser una de: ${SUPPORTED_CITIES.join(
          ", "
        )}`,
      }),
    destinationCity: z
      .string()
      .min(1, "Ciudad de destino es requerida")
      .trim()
      .refine((city) => SUPPORTED_CITIES.includes(city), {
        message: `Ciudad de destino debe ser una de: ${SUPPORTED_CITIES.join(
          ", "
        )}`,
      }),
    weight: z
      .number()
      .positive("El peso debe ser mayor a 0")
      .max(MAX_WEIGHT, `El peso no puede exceder ${MAX_WEIGHT} kg`),
    height: z
      .number()
      .positive("La altura debe ser mayor a 0")
      .min(MIN_DIMENSION, `La altura debe ser mínimo ${MIN_DIMENSION} cm`)
      .max(MAX_DIMENSION, `La altura no puede exceder ${MAX_DIMENSION} cm`),
    width: z
      .number()
      .positive("El ancho debe ser mayor a 0")
      .min(MIN_DIMENSION, `El ancho debe ser mínimo ${MIN_DIMENSION} cm`)
      .max(MAX_DIMENSION, `El ancho no puede exceder ${MAX_DIMENSION} cm`),
    length: z
      .number()
      .positive("La longitud debe ser mayor a 0")
      .min(MIN_DIMENSION, `La longitud debe ser mínimo ${MIN_DIMENSION} cm`)
      .max(MAX_DIMENSION, `La longitud no puede exceder ${MAX_DIMENSION} cm`),
  })
  .refine(
    (data) =>
      data.originCity.toLowerCase() !== data.destinationCity.toLowerCase(),
    {
      message: "La ciudad de destino debe ser diferente a la ciudad de origen",
      path: ["destinationCity"],
    }
  );

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
