import mysql from "mysql2/promise";
import "dotenv/config";
const checkDatabaseService = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: process.env.DB_PASSWORD,
      database: "coodb",
    });

    await connection.query("SELECT 1");
    console.log("DB Successfully connected");
    await connection.end();
  } catch (error) {
    console.error("Error connecting:", error);
  }
};

export default checkDatabaseService;
