export const env = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME || "coodb",

  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
