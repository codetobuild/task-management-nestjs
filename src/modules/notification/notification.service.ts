import { Injectable, OnModuleInit } from "@nestjs/common";
import { TaskConsumer } from "src/broker/consumers/task.consumer";

@Injectable()
export class NotificationService implements OnModuleInit {
  private taskConsumer: TaskConsumer;

  async onModuleInit() {
    this.taskConsumer = new TaskConsumer();
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
