import pool from "@infrastructure/database/connection";
import fs from "fs";
import path from "path";

const checkDatabaseService = async () => {
  try {
    const connection = await pool.getConnection();

    connection.release();
    await runMigrations();
  } catch (error) {
    throw error;
  }
};

const runMigrations = async () => {
  try {
    const migrationsPath = path.join(
      process.cwd(),
      "src",
      "infrastructure",
      "database",
      "migrations"
    );

    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await pool.execute(sql);
    }
  } catch (error) {
    throw error;
  }
};

export default checkDatabaseService;
