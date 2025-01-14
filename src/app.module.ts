import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TaskModule } from "./modules/task/task.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { DatabaseModule } from "./database/database.module";
import { WinstonModule } from "nest-winston";
import { winstonLoggerConfig } from "./config/winston-logger.config";
import { RedisModule } from "./redis/redis.module";
import { RabbitMQModule } from "./broker/rabbitmq.module";
import { ThrottlerModule, ThrottlerModuleOptions } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { CustomThrottlerGuard } from "./common/guards/throttler.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<ThrottlerModuleOptions> => ({
        throttlers: [
          {
            ttl: configService.get<number>("RATE_LIMIT_WINDOW_MS", 60000),
            limit: configService.get<number>("RATE_LIMIT_MAX", 10),
          },
        ],
      }),
    }),
    WinstonModule.forRoot(winstonLoggerConfig),
    TaskModule,
    NotificationModule,
    DatabaseModule,
    RedisModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    console.log("###################");
    console.log(
      `AppModule loaded with environment ${this.configService.get("NODE_ENV")}`,
    );
    console.log("###################");
  }
}
