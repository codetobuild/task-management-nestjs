import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Task } from "./models/task.model";
import { Dialect } from "sequelize";

/**
 * DatabaseModule
 *
 * This module is responsible for providing the database connection and configuration
 * services to the application. It uses Sequelize for ORM and integrates with the
 * ConfigService to load database configuration from environment variables.
 */
// @Global()
@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get("DB_DIALECT") as Dialect,
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        logging: false,
        models: [Task], // Add your models here
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
  providers: [],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
