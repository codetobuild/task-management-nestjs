import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { TaskNotificationMessage } from "../../common/interfaces/taskNotification.interface";
import { RabbitMQConfigService } from "src/config";

/**
 * TaskPublisher is responsible for publishing task-related messages to a RabbitMQ exchange.
 * It manages the connection and channel to RabbitMQ and provides methods to connect, publish messages, and disconnect.
 */
@Injectable()
export class TaskPublisher {
  /**
   * The RabbitMQ connection instance.
   */
  private connection: amqp.Connection;

  /**
   * The RabbitMQ channel instance.
   */
  private channel: amqp.Channel;

  /**
   * Constructs a new TaskPublisher instance.
   * @param rabbitmqConfigService - The service providing RabbitMQ configuration.
   */
  constructor(private readonly rabbitmqConfigService: RabbitMQConfigService) {}

  /**
   * Establishes a connection to RabbitMQ and creates a channel.
   * Asserts the exchange defined in the configuration.
   * @throws Will throw an error if the connection or channel creation fails.
   */
  async connect() {
    this.connection = await amqp.connect({
      hostname: this.rabbitmqConfigService.host,
      port: this.rabbitmqConfigService.port,
      username: this.rabbitmqConfigService.username,
      password: this.rabbitmqConfigService.password,
    });

    this.channel = await this.connection.createChannel();

    // Assert the exchange
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

    console.log(
      `Message published: ${JSON.stringify(message)} with routingKey: ${routingKey}`,
    );
  }

  /**
   * Closes the RabbitMQ channel and connection.
   * @throws Will throw an error if the channel or connection closure fails.
   */
  async disconnect() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
