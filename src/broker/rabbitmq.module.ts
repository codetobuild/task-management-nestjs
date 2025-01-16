import { Module, Global } from "@nestjs/common";
import { TaskPublisher } from "./publishers";
import { TaskConsumer } from "./consumers";
import { RabbitMQConfigService } from "src/config/rabbitmq.config";
import { RabbitMQService } from "./rabbitmq.service";

/**
 * RabbitMQModule
 *
 * This module is responsible for providing RabbitMQ connection and configuration
 * services to the application. It includes TaskPublisher and TaskConsumer for
 * publishing and consuming messages, respectively.
 */
@Global()
@Module({
  providers: [
    RabbitMQService,
    TaskPublisher,
    TaskConsumer,
    RabbitMQConfigService,
  ],
  exports: [
    RabbitMQService,
    TaskPublisher,
    TaskConsumer,
    RabbitMQConfigService,
  ],
})
export class RabbitMQModule {}
