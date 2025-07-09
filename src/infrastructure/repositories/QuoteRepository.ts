import {
  QuoteRepository,
  RateDetails,
} from "@application/interfaces/quote-repository.interface";
import {
  QuoteHistoryDTO,
  CreateQuoteHistoryDTO,
} from "@application/dtos/quote-history.dto";
import pool from "@infrastructure/database/connection";
import { RateRow, QuoteHistoryRow } from "@infrastructure/database/types";

export class QuoteRepositoryImpl implements QuoteRepository {
  async findRate(
    origin: string,
    destination: string,
    weight: number
  ): Promise<number | null> {
    try {
      const [rows] = await pool.execute(
        `SELECT base_price
         FROM rates 
         WHERE origin_city = ? 
         AND destination_city = ? 
         AND weight_min <= ? 
         AND weight_max >= ?
         ORDER BY weight_min ASC
         LIMIT 1`,
        [origin, destination, weight, weight]
      );

      const rates = rows as RateRow[];
      if (rates.length === 0) {
        return null;
      }

      const rate = rates[0];
      return rate.base_price;
    } catch (error) {
      throw new Error("Error de base de datos al buscar tarifa");
    }
  }

  async findRateDetails(
    origin: string,
    destination: string,
    weight: number
  ): Promise<RateDetails | null> {
    try {
      const [rows] = await pool.execute(
        `SELECT base_price
         FROM rates 
         WHERE origin_city = ? 
         AND destination_city = ? 
         AND weight_min <= ? 
         AND weight_max >= ?
         ORDER BY weight_min ASC
         LIMIT 1`,
        [origin, destination, weight, weight]
      );

      const rates = rows as RateRow[];
      if (rates.length === 0) {
        return null;
      }

      const rate = rates[0];
      return {
        basePrice: rate.base_price,
      };
    } catch (error) {
      throw new Error("Error de base de datos al buscar detalles de tarifa");
    }
  }
}
