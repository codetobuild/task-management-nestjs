import { Global, Module } from "@nestjs/common";
import {
  RedisModule as IoRedisModule,
  RedisModuleOptions,
} from "@nestjs-modules/ioredis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { RedisConfigService } from "src/config";

/**
 * RedisModule
 *
 * This module is responsible for providing Redis connection and configuration
 * services to the application. It uses @nestjs-modules/ioredis for Redis integration
 * and integrates with the ConfigService to load Redis configuration from environment variables.
 */
@Global()
@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [RedisConfigService],
      useFactory: (configService: RedisConfigService): RedisModuleOptions => ({
        url: `${configService.host}:${configService.port}`,
        type: "single",
      }),
    }),
  ],
  providers: [ConfigService, RedisConfigService, RedisService],
  exports: [RedisConfigService, RedisService],
})
export class RedisModule {}
