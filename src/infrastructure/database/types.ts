import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";

export type DatabaseConnection = Connection;
export type DatabaseRow = RowDataPacket;
export type DatabaseResult = ResultSetHeader;

export interface DatabaseRowArray extends Array<DatabaseRow> {}

export interface OrderRow extends DatabaseRow {
  id: number;
  user_id: number;
  origin_city: string;
  destination_city: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  base_price: number;
  tracking_code: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRow extends DatabaseRow {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  created_at: Date;
  updated_at: Date;
}

export interface QuoteHistoryRow extends DatabaseRow {
  id: number;
  user_id: number;
  origin_city: string;
  destination_city: string;
  actual_weight: number;
  volume_weight: number;
  selected_weight: number;
  height: number;
  width: number;
  length: number;
  base_price: number;
  created_at: Date;
}

export interface RateRow extends DatabaseRow {
  id: number;
  origin_city: string;
  destination_city: string;
  base_price: number;
  created_at: Date;
  updated_at: Date;
}
