import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";

export const winstonLoggerConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ context, level, message, timestamp }) => {
          return `[${timestamp}] ${level} [${context}] ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: "logs/winston.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
