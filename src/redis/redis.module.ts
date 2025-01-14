import { Global, Module } from "@nestjs/common";
import {
  RedisModule as IoRedisModule,
  RedisModuleOptions,
} from "@nestjs-modules/ioredis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { RedisConfigService } from "src/config";

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
