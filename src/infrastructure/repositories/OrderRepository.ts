import { OrderRepository } from "@application/interfaces/order-repository.interface";
import { CreateOrderDTO } from "@application/dtos/create-order.dto";
import { OrderDTO } from "@application/dtos/order.dto";
import {
  OrderTrackingDto,
  OrderStatusDto,
  UpdateOrderStatusDto,
} from "@application/dtos/order-status.dto";
import pool from "@infrastructure/database/connection";
import { generateTrackingCode } from "@shared/utils/tracking-code.util";
import { SocketService } from "@infrastructure/websocket/socket.service";
import {
  DatabaseConnection,
  DatabaseResult,
  DatabaseRow,
  OrderRow,
} from "@infrastructure/database/types";

export class OrderRepositoryImpl implements OrderRepository {
  async createOrder(
    orderData: CreateOrderDTO,
    userId: number
  ): Promise<OrderDTO> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const trackingCode = await this.generateUniqueTrackingCode(connection);

      const query = `
        INSERT INTO shipping_orders 
        (user_id, origin_city, destination_city, weight, height, width, length, base_price, tracking_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        orderData.originCity,
        orderData.destinationCity,
        orderData.weight,
        orderData.height,
        orderData.width,
        orderData.length,
        orderData.basePrice,
        trackingCode,
      ];

      const [result] = await connection.execute(query, values);
      const insertId = (result as DatabaseResult).insertId;

      await this.addStatusToHistoryWithConnection(
        connection,
        insertId,
        "pending",
        "Orden creada"
      );

      await connection.commit();

      const createdOrder = await this.findOrderById(insertId);
      if (!createdOrder) {
        throw new Error("Error al crear la orden");
      }

      return createdOrder;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private async generateUniqueTrackingCode(
    connection: DatabaseConnection
  ): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const trackingCode = generateTrackingCode();

      const [existing] = await connection.execute(
        "SELECT id FROM shipping_orders WHERE tracking_code = ?",
        [trackingCode]
      );

      if ((existing as OrderRow[]).length === 0) {
        return trackingCode;
      }

      attempts++;
    }

    const timestamp = Date.now().toString();
    return `COO-${timestamp.slice(-10)}`;
  }

  async findOrdersByUserId(userId: number): Promise<OrderDTO[]> {
    const query = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             base_price, tracking_code, status, created_at, updated_at
      FROM shipping_orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);
    return this.mapRowsToOrders(rows as OrderRow[]);
  }

  async findAllOrders(): Promise<OrderDTO[]> {
    const query = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             base_price, tracking_code, status, created_at, updated_at
      FROM shipping_orders 
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query);
    return this.mapRowsToOrders(rows as OrderRow[]);
  }

  async findOrderById(id: number): Promise<OrderDTO | null> {
    const query = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             base_price, tracking_code, status, created_at, updated_at
      FROM shipping_orders 
      WHERE id = ?
    `;

    const [rows] = await pool.execute(query, [id]);
    const orders = this.mapRowsToOrders(rows as OrderRow[]);
    return orders.length > 0 ? orders[0] : null;
  }

  async findOrderByTrackingCode(
    trackingCode: string
  ): Promise<OrderDTO | null> {
    const query = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             base_price, tracking_code, status, created_at, updated_at
      FROM shipping_orders 
      WHERE tracking_code = ?
    `;

    const [rows] = await pool.execute(query, [trackingCode]);
    const orders = this.mapRowsToOrders(rows as OrderRow[]);
    return orders.length > 0 ? orders[0] : null;
  }

  async findOrderWithTrackingById(
    id: number
  ): Promise<OrderTrackingDto | null> {
    const orderQuery = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             base_price, tracking_code, status, created_at, updated_at
      FROM shipping_orders 
      WHERE id = ?
    `;
    const [orderRows] = await pool.execute(orderQuery, [id]);
    const orders = this.mapRowsToOrders(orderRows as OrderRow[]);

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];
    const statusHistory = await this.getOrderStatusHistory(id);

    return {
      ...order,
      statusHistory,
    };
  }

  async findOrderWithTrackingByTrackingCode(
    trackingCode: string
  ): Promise<OrderTrackingDto | null> {
    const orderQuery = `
      SELECT id, user_id, origin_city, destination_city, weight, height, width, length, 
             base_price, tracking_code, status, created_at, updated_at
      FROM shipping_orders 
      WHERE tracking_code = ?
    `;
    const [orderRows] = await pool.execute(orderQuery, [trackingCode]);
    const orders = this.mapRowsToOrders(orderRows as OrderRow[]);

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];
    const statusHistory = await this.getOrderStatusHistory(order.id);

    return {
      ...order,
      statusHistory,
    };
  }

  async updateOrderStatus(updateData: UpdateOrderStatusDto): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const updateQuery = `
        UPDATE shipping_orders 
        SET status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      await connection.execute(updateQuery, [
        updateData.newStatus,
        updateData.orderId,
      ]);

      await this.addStatusToHistoryWithConnection(
        connection,
        updateData.orderId,
        updateData.newStatus,
        updateData.notes
      );

      await connection.commit();

      const updatedOrder = await this.findOrderById(updateData.orderId);
      if (updatedOrder) {
        const socketService = SocketService.getInstance();
        socketService.emitOrderUpdate(updatedOrder.userId, updatedOrder);
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getOrderStatusHistory(orderId: number): Promise<OrderStatusDto[]> {
    const query = `
      SELECT id, order_id, status, changed_at, notes
      FROM order_status_history 
      WHERE order_id = ? 
      ORDER BY changed_at ASC
    `;

    const [rows] = await pool.execute(query, [orderId]);
    return (rows as DatabaseRow[]).map((row) => ({
      id: row.id,
      status: row.status,
      changed_at: row.changed_at,
      notes: row.notes,
    }));
  }

  async addStatusToHistory(
    orderId: number,
    status: string,
    notes?: string
  ): Promise<void> {
    const query = `
      INSERT INTO order_status_history (order_id, status, notes)
      VALUES (?, ?, ?)
    `;

    await pool.execute(query, [orderId, status, notes]);
  }

  private async addStatusToHistoryWithConnection(
    connection: DatabaseConnection,
    orderId: number,
    status: string,
    notes?: string
  ): Promise<void> {
    const query = `
      INSERT INTO order_status_history (order_id, status, notes)
      VALUES (?, ?, ?)
    `;

    await connection.execute(query, [orderId, status, notes]);
  }

  private mapRowsToOrders(rows: OrderRow[]): OrderDTO[] {
    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      originCity: row.origin_city,
      destinationCity: row.destination_city,
      weight: row.weight,
      height: row.height,
      width: row.width,
      length: row.length,
      basePrice: row.base_price,
      trackingCode: row.tracking_code,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}
