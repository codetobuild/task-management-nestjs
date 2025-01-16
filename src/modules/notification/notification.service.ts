import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { TaskConsumer } from "src/broker/consumers";
import { Logger } from "winston";

/**
 * Service responsible for handling notifications related to tasks.
 */
@Injectable()
export class NotificationService {
  /**
   * Constructs a new instance of the NotificationService.
   * @param taskConsumer - The consumer responsible for handling task messages.
   */
  constructor(
    private readonly taskConsumer: TaskConsumer,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
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
      this.logger.info(message, { service: "NotificationService" });
    });
  }
}
