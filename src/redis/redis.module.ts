import { Global, Module } from "@nestjs/common";
import {
  RedisModule as IoRedisModule,
  RedisModuleOptions,
} from "@nestjs-modules/ioredis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";

@Global()
@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => ({
        url: `${configService.get<string>("REDIS_HOST", "127.0.0.1")}:${configService.get<number>("REDIS_PORT", 6379)}`,
        type: "single",
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
