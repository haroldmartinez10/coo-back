import { QuoteOrderDTO } from "@application/dtos/quote-order-dto";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateQuoteRequest = (
  data: any
): {
  isValid: boolean;
  errors: ValidationError[];
  validatedData?: QuoteOrderDTO;
} => {
  const errors: ValidationError[] = [];

  // Validate origin city
  if (
    !data.originCity ||
    typeof data.originCity !== "string" ||
    data.originCity.trim().length === 0
  ) {
    errors.push({
      field: "originCity",
      message: "Origin city is required and must be a valid string",
    });
  }

  // Validate destination city
  if (
    !data.destinationCity ||
    typeof data.destinationCity !== "string" ||
    data.destinationCity.trim().length === 0
  ) {
    errors.push({
      field: "destinationCity",
      message: "Destination city is required and must be a valid string",
    });
  }

  // Validate weight
  if (!data.weight || typeof data.weight !== "number" || data.weight <= 0) {
    errors.push({
      field: "weight",
      message: "Weight is required and must be a positive number",
    });
  }

  // Validate height
  if (!data.height || typeof data.height !== "number" || data.height <= 0) {
    errors.push({
      field: "height",
      message: "Height is required and must be a positive number",
    });
  }

  // Validate width
  if (!data.width || typeof data.width !== "number" || data.width <= 0) {
    errors.push({
      field: "width",
      message: "Width is required and must be a positive number",
    });
  }

  // Validate length
  if (!data.length || typeof data.length !== "number" || data.length <= 0) {
    errors.push({
      field: "length",
      message: "Length is required and must be a positive number",
    });
  }

  // Check for same origin and destination
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
