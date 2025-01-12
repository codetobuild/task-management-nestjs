import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TaskModule } from "./modules/task/task.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { DatabaseModule } from "./database/database.module";
import { WinstonModule } from "nest-winston";
import { winstonLoggerConfig } from "./config/winston-logger.config";
import { RedisModule } from "./redis/redis.module";
import { RabbitMQModule } from "./broker/rabbitmq.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    WinstonModule.forRoot(winstonLoggerConfig),
    TaskModule,
    NotificationModule,
    DatabaseModule,
    RedisModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
