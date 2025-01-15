import { Global, Module } from "@nestjs/common";
import { DatabaseConfigService } from "../config";
import { databaseProviders } from "./database.providers";
import { ConfigService } from "@nestjs/config";

/**
 * DatabaseModule
 *
 * This module is responsible for providing the database connection and configuration
 * services to the application. It uses Sequelize for ORM and integrates with the
 * ConfigService to load database configuration from environment variables.
 */
@Global()
@Module({
  providers: [...databaseProviders, ConfigService, DatabaseConfigService],
  exports: [...databaseProviders, DatabaseConfigService],
})
export class DatabaseModule {}
