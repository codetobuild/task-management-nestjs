import { Module, Global, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { TaskPublisher } from "./publishers/task.publisher";
import { TaskConsumer } from "./consumers/task.consumer";

@Global()
@Module({
  providers: [TaskPublisher, TaskConsumer],
  exports: [TaskPublisher, TaskConsumer],
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
