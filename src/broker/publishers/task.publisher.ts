import * as amqp from "amqplib";
import { TaskNotificationMessage } from "../../common/interfaces/taskNotification.interface";
import { RabbitMQConfigService } from "src/config";
import { RabbitMQService } from "../rabbitmq.service";
import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

/**
 * TaskPublisher is responsible for publishing task-related messages to a RabbitMQ exchange.
 * It manages the connection and channel to RabbitMQ and provides methods to connect, publish messages, and disconnect.
 */
@Injectable()
export class TaskPublisher {
  /**
   * The RabbitMQ channel instance.
   */
  private channel: amqp.Channel;

  /**
   * Constructs a new TaskPublisher instance.
   * @param rabbitmqConfigService - The service providing RabbitMQ configuration.
   */
  constructor(
    private readonly rabbitmqConfigService: RabbitMQConfigService,
    private readonly rabbitmqService: RabbitMQService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async connect() {
    this.channel = await this.rabbitmqService.getChannel();
    if (this.channel) {
      await this.setup();
    } else {
      throw new Error("RabbitMQ channel is not initialized");
    }
  }

  /**
   * Sets up the exchange for publishing messages.
   */
  async setup() {
    await this.channel.assertExchange(
      this.rabbitmqConfigService.taskConfig.EXCHANGE,
      this.rabbitmqConfigService.taskConfig.EXCHANGE_TYPE,
      { durable: true },
    );
  }

  /**
   * Publishes a message to the RabbitMQ exchange with the specified routing key.
   * @param message - The message to be published.
   * @param routingKey - The routing key to use for the message.
   * @throws Will throw an error if the RabbitMQ channel is not initialized.
   */
  async publish(
    message: TaskNotificationMessage,
    routingKey: string,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(
      this.rabbitmqConfigService.taskConfig.EXCHANGE,
      routingKey,
      messageBuffer,
      {
        persistent: true,
      },
    );

    this.logger.info(
      `Message published: ${JSON.stringify(message)} with routingKey: ${routingKey}`,
    );
  }
}
