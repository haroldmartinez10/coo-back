import { OrderRepository } from "@application/interfaces/order-repository.interface";
import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";
import pool from "@infrastructure/database/connection";

export class OrderRepositoryImpl implements OrderRepository {
  async createOrder(
    orderData: CreateOrderDTO,
    userId: number
  ): Promise<OrderDTO> {
    const query = `
      INSERT INTO shipping_orders 
      (user_id, origin_city, destination_city, weight, height, width, length, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      orderData.originCity,
      orderData.destinationCity,
      orderData.weight,
      orderData.height,
      orderData.width,
      orderData.length,
      orderData.totalPrice,
    ];

    const [result] = await pool.execute(query, values);
    const insertId = (result as any).insertId;

    const createdOrder = await this.findOrderById(insertId);
    if (!createdOrder) {
      throw new Error("Error creating order");
    }

    return createdOrder;
  }

  async findOrdersByUserId(userId: number): Promise<OrderDTO[]> {
    const query = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             total_price, status, created_at, updated_at
      FROM shipping_orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);
    return this.mapRowsToOrders(rows as any[]);
  }

  async findOrderById(id: number): Promise<OrderDTO | null> {
    const query = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             total_price, status, created_at, updated_at
      FROM shipping_orders 
      WHERE id = ?
    `;

    const [rows] = await pool.execute(query, [id]);
    const orders = this.mapRowsToOrders(rows as any[]);
    return orders.length > 0 ? orders[0] : null;
  }

  private mapRowsToOrders(rows: any[]): OrderDTO[] {
    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      originCity: row.origin_city,
      destinationCity: row.destination_city,
      weight: parseFloat(row.weight),
      height: parseFloat(row.height),
      width: parseFloat(row.width),
      length: parseFloat(row.length),
      totalPrice: parseFloat(row.total_price),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}
