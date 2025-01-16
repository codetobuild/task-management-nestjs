import { Injectable } from "@nestjs/common";
import { TaskConsumer } from "src/broker/consumers";

/**
 * Service responsible for handling notifications related to tasks.
 */
@Injectable()
export class NotificationService {
  /**
   * Constructs a new instance of the NotificationService.
   * @param taskConsumer - The consumer responsible for handling task messages.
   */
  constructor(private readonly taskConsumer: TaskConsumer) {
    this.initialize();
  }

  /**
   * Initializes the notification service by connecting the task consumer
   * and setting up the task notification handler.
   */
  private async initialize() {
    await this.taskConsumer.connect();
    this.getTaskNotification();
  }

  /**
   * Retrieves task notifications by consuming messages from the task consumer.
   * Logs the content of each consumed message.
   */
  async getTaskNotification() {
    await this.taskConsumer.consumeMessages((message: any) => {
      console.log("############# consumer message content ##############");
      console.log(message);
    });
  }
}
