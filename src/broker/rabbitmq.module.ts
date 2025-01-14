import { Module, Global, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { TaskPublisher } from "./publishers";
import { TaskConsumer } from "./consumers";
import { RabbitMQConfigService } from "src/config/rabbitmq.config";

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

  async onModuleInit() {
    await this.publisher.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    // Gracefully shutdown publisher and consumer
    await this.publisher.disconnect();
    await this.consumer.disconnect();
  }
}
