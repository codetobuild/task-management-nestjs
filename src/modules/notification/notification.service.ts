import { Injectable, OnModuleInit } from "@nestjs/common";
import { TaskConsumer } from "src/broker/consumers";
import { RabbitMQConfigService } from "src/config/rabbitmq.config";

@Injectable()
export class NotificationService implements OnModuleInit {
  private taskConsumer: TaskConsumer;
  constructor(private rabbitmqConfigService: RabbitMQConfigService) {}

  async onModuleInit() {
    this.taskConsumer = new TaskConsumer(this.rabbitmqConfigService);
    await this.taskConsumer.connect();
    this.getTaskNotification();
  }

  async getTaskNotification() {
    await this.taskConsumer.consumeMessages((message: any) => {
      console.log("################################");
      console.log(message);
    });
  }
}
