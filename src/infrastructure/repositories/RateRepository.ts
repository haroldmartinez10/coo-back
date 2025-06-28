import { RateRepository } from "@application/interfaces/quote-repository.interface";
import pool from "@infrastructure/database/connection";

export class RateRepositoryImpl implements RateRepository {
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
      const totalPrice = rate.base_price + weight * rate.price_per_kg;

      return totalPrice;
    } catch (error) {
      console.error("Error finding rate:", error);
      throw new Error("Database error while finding rate");
    }
  }
}
