import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import "winston-daily-rotate-file";
import * as path from "path";
import * as winston from "winston";
import { LOGS_DIRECTORY } from "../common/constants";

/**
 * Winston Logger Configuration
 *
 * This configuration sets up Winston logger with multiple transports including
 * console and rotating file transports for both info and error logs.
 */
export const winstonLoggerConfig = {
  transports: [
    // Console Transport
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike("TaskManagement", {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),

    // Rotating File Transport for Info logs
    new winston.transports.DailyRotateFile({
      filename: path.join(LOGS_DIRECTORY, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // Rotating File Transport for Error logs
    new winston.transports.DailyRotateFile({
      filename: path.join(LOGS_DIRECTORY, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
