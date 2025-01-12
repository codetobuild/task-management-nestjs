import { Module, Global, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { RabbitMQPublisher } from "./producers/task.producer";
import { RabbitMQConsumer } from "./consumers/task.consumer";

@Global()
@Module({
  providers: [RabbitMQPublisher, RabbitMQConsumer],
  exports: [RabbitMQPublisher, RabbitMQConsumer],
})
export class RabbitMQModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly publisher: RabbitMQPublisher,
    private readonly consumer: RabbitMQConsumer,
  ) {}

  async onModuleInit() {
    // Initialize both publisher and consumer
    await this.publisher.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    // Gracefully shutdown publisher and consumer
    await this.publisher.disconnect();
    await this.consumer.disconnect();
  }
}
