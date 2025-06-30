import pool from "@infrastructure/database/connection";
import fs from "fs";
import path from "path";

const checkDatabaseService = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
    await runMigrations();
  } catch (error) {
    console.error("Conexión a la base de datos falló:", error);
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

      console.log(`Executing migration: ${file}`);
      await pool.execute(sql);
      console.log(`✅ Migration completed: ${file}`);
    }

    console.log("✅ All migrations completed successfully");
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    throw error;
  }
};

export default checkDatabaseService;
