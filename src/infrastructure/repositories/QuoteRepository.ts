import {
  QuoteRepository,
  RateDetails,
} from "@application/interfaces/quote-repository.interface";
import {
  QuoteHistoryDTO,
  CreateQuoteHistoryDTO,
} from "@application/dtos/quote-history.dto";
import pool from "@infrastructure/database/connection";

export class QuoteRepositoryImpl implements QuoteRepository {
  async findRate(
    origin: string,
    destination: string,
    weight: number
  ): Promise<number | null> {
    try {
      const [rows] = await pool.execute(
        `SELECT base_price, price_per_kg 
         FROM rates 
         WHERE origin_city = ? 
         AND destination_city = ? 
         AND weight_min <= ? 
         AND weight_max >= ?
         ORDER BY weight_min ASC
         LIMIT 1`,
        [origin, destination, weight, weight]
      );

      const rates = rows as any[];
      if (rates.length === 0) {
        return null;
      }

      const rate = rates[0];
      return rate.base_price;
    } catch (error) {
      console.error("Error finding rate:", error);
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
        `SELECT base_price, price_per_kg 
         FROM rates 
         WHERE origin_city = ? 
         AND destination_city = ? 
         AND weight_min <= ? 
         AND weight_max >= ?
         ORDER BY weight_min ASC
         LIMIT 1`,
        [origin, destination, weight, weight]
      );

      const rates = rows as any[];
      if (rates.length === 0) {
        return null;
      }

      const rate = rates[0];
      return {
        basePrice: rate.base_price,
        pricePerKg: rate.price_per_kg,
      };
    } catch (error) {
      console.error("Error finding rate details:", error);
      throw new Error("Error de base de datos al buscar detalles de tarifa");
    }
  }

  async saveQuoteHistory(
    quoteData: CreateQuoteHistoryDTO
  ): Promise<QuoteHistoryDTO> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO quote_history 
         (user_id, origin_city, destination_city, actual_weight, volume_weight, 
          selected_weight, height, width, length, base_price, price_per_kg)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quoteData.userId,
          quoteData.originCity,
          quoteData.destinationCity,
          quoteData.actualWeight,
          quoteData.volumeWeight,
          quoteData.selectedWeight,
          quoteData.height,
          quoteData.width,
          quoteData.length,
          quoteData.basePrice,
          quoteData.pricePerKg,
        ]
      );

      const insertResult = result as any;
      const insertId = insertResult.insertId;

      const [rows] = await pool.execute(
        `SELECT * FROM quote_history WHERE id = ?`,
        [insertId]
      );

      const savedQuote = (rows as any[])[0];
      return {
        id: savedQuote.id,
        userId: savedQuote.user_id,
        originCity: savedQuote.origin_city,
        destinationCity: savedQuote.destination_city,
        actualWeight: savedQuote.actual_weight,
        volumeWeight: savedQuote.volume_weight,
        selectedWeight: savedQuote.selected_weight,
        height: savedQuote.height,
        width: savedQuote.width,
        length: savedQuote.length,
        basePrice: savedQuote.base_price,
        pricePerKg: savedQuote.price_per_kg,
        createdAt: savedQuote.created_at,
      };
    } catch (error) {
      console.error("Error saving quote history:", error);
      throw new Error(
        "Error de base de datos al guardar historial de cotización"
      );
    }
  }

  async getQuoteHistory(userId: number): Promise<QuoteHistoryDTO[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM quote_history 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [userId]
      );

      const quotes = rows as any[];
      return quotes.map((quote) => ({
        id: quote.id,
        userId: quote.user_id,
        originCity: quote.origin_city,
        destinationCity: quote.destination_city,
        actualWeight: quote.actual_weight,
        volumeWeight: quote.volume_weight,
        selectedWeight: quote.selected_weight,
        height: quote.height,
        width: quote.width,
        length: quote.length,
        basePrice: quote.base_price,
        pricePerKg: quote.price_per_kg,
        createdAt: quote.created_at,
      }));
    } catch (error) {
      console.error("Error getting quote history:", error);
      throw new Error("Database error while getting quote history");
    }
  }
}
