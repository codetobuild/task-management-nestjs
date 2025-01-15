import { Module, Global, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { TaskPublisher } from "./publishers";
import { TaskConsumer } from "./consumers";
import { RabbitMQConfigService } from "src/config/rabbitmq.config";

/**
 * RabbitMQModule
 *
 * This module is responsible for providing RabbitMQ connection and configuration
 * services to the application. It includes TaskPublisher and TaskConsumer for
 * publishing and consuming messages, respectively.
 */
@Global()
@Module({
  providers: [TaskPublisher, TaskConsumer, RabbitMQConfigService],
  exports: [TaskPublisher, TaskConsumer, RabbitMQConfigService],
})
export class RabbitMQModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly publisher: TaskPublisher,
    private readonly consumer: TaskConsumer,
  ) {}

  /**
   * Lifecycle hook that is called when the module is initialized.
   * It connects the publisher and consumer to RabbitMQ.
   */
  async onModuleInit() {
    await this.publisher.connect();
    await this.consumer.connect();
  }

  /**
   * Lifecycle hook that is called when the module is destroyed.
   * It disconnects the publisher and consumer from RabbitMQ.
   */
  async onModuleDestroy() {
    // Gracefully shutdown publisher and consumer
    await this.publisher.disconnect();
    await this.consumer.disconnect();
  }
}
