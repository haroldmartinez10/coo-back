import { IUserRepository } from "@application/interfaces/user-repository.interface";
import { User } from "@domain/entities/User";
import pool from "@infrastructure/database/connection";
import { UserRow, DatabaseResult } from "@infrastructure/database/types";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        "SELECT id, email, password_hash, name, role FROM users WHERE email = ?",
        [email]
      );

      const users = rows as UserRow[];
      if (users.length === 0) {
        return null;
      }

      const userData = users[0];
      return new User(
        userData.id,
        userData.email,
        userData.password_hash,
        userData.name,
        userData.role
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error de base de datos al buscar usuario");
    }
  }

  async save(user: User): Promise<User> {
    try {
      const [result] = await pool.execute(
        "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
        [user.email, user.password, user.name, user.role]
      );

      const insertResult = result as DatabaseResult;
      const savedUser = new User(
        insertResult.insertId,
        user.email,
        user.password,
        user.name,
        user.role
      );

      return savedUser;
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Error de base de datos al guardar usuario");
    }
  }
}
