import { Global, Module } from "@nestjs/common";
import { DatabaseConfigService } from "../config";
import { databaseProviders } from "./database.providers";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  providers: [...databaseProviders, ConfigService, DatabaseConfigService],
  exports: [...databaseProviders, DatabaseConfigService],
})
export class DatabaseModule {}
