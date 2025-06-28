import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";

export interface ValidationError {
  field: string;
  message: string;
}

const SUPPORTED_CITIES = ["Bogotá", "Medellín", "Cali", "Barranquilla"];
const MAX_WEIGHT = 1000;
const MIN_DIMENSION = 1;
const MAX_DIMENSION = 300;

export const validateQuoteRequest = (
  data: any
): {
  isValid: boolean;
  errors: ValidationError[];
  validatedData?: QuoteOrderDTO;
} => {
  const errors: ValidationError[] = [];

  if (
    !data.originCity ||
    typeof data.originCity !== "string" ||
    data.originCity.trim().length === 0
  ) {
    errors.push({
      field: "originCity",
      message: "Origin city is required and must be a valid string",
    });
  } else if (!SUPPORTED_CITIES.includes(data.originCity.trim())) {
    errors.push({
      field: "originCity",
      message: `Origin city must be one of: ${SUPPORTED_CITIES.join(", ")}`,
    });
  }

  if (
    !data.destinationCity ||
    typeof data.destinationCity !== "string" ||
    data.destinationCity.trim().length === 0
  ) {
    errors.push({
      field: "destinationCity",
      message: "Destination city is required and must be a valid string",
    });
  } else if (!SUPPORTED_CITIES.includes(data.destinationCity.trim())) {
    errors.push({
      field: "destinationCity",
      message: `Destination city must be one of: ${SUPPORTED_CITIES.join(
        ", "
      )}`,
    });
  }

  if (!data.weight || typeof data.weight !== "number" || data.weight <= 0) {
    errors.push({
      field: "weight",
      message: "Weight is required and must be a positive number",
    });
  } else if (data.weight > MAX_WEIGHT) {
    errors.push({
      field: "weight",
      message: `Weight cannot exceed ${MAX_WEIGHT} kg`,
    });
  }

  if (!data.height || typeof data.height !== "number" || data.height <= 0) {
    errors.push({
      field: "height",
      message: "Height is required and must be a positive number",
    });
  } else if (data.height < MIN_DIMENSION || data.height > MAX_DIMENSION) {
    errors.push({
      field: "height",
      message: `Height must be between ${MIN_DIMENSION} and ${MAX_DIMENSION} cm`,
    });
  }

  if (!data.width || typeof data.width !== "number" || data.width <= 0) {
    errors.push({
      field: "width",
      message: "Width is required and must be a positive number",
    });
  } else if (data.width < MIN_DIMENSION || data.width > MAX_DIMENSION) {
    errors.push({
      field: "width",
      message: `Width must be between ${MIN_DIMENSION} and ${MAX_DIMENSION} cm`,
    });
  }

  if (!data.length || typeof data.length !== "number" || data.length <= 0) {
    errors.push({
      field: "length",
      message: "Length is required and must be a positive number",
    });
  } else if (data.length < MIN_DIMENSION || data.length > MAX_DIMENSION) {
    errors.push({
      field: "length",
      message: `Length must be between ${MIN_DIMENSION} and ${MAX_DIMENSION} cm`,
    });
  }

  if (
    data.originCity &&
    data.destinationCity &&
    data.originCity.trim().toLowerCase() ===
      data.destinationCity.trim().toLowerCase()
  ) {
    errors.push({
      field: "destinationCity",
      message: "Destination city must be different from origin city",
    });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const validatedData: QuoteOrderDTO = {
    originCity: data.originCity.trim(),
    destinationCity: data.destinationCity.trim(),
    weight: Number(data.weight),
    height: Number(data.height),
    width: Number(data.width),
    length: Number(data.length),
  };

  return { isValid: true, errors: [], validatedData };
};
