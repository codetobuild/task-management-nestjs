import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_management_db",
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },
}));
