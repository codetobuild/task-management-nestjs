import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { RabbitMQConfigService } from "src/config";

/**
 * TaskConsumer
 *
 * This class is responsible for consuming task-related messages from RabbitMQ.
 * It manages the connection and channel to RabbitMQ and provides methods to connect,
 * consume messages, and disconnect.
 */
@Injectable()
export class TaskConsumer {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly rabbitmqConfigService: RabbitMQConfigService) {}

  /**
   * Connect to RabbitMQ and set up the channel, exchange, and queues.
   */
  async connect() {
    this.connection = await amqp.connect({
      hostname: this.rabbitmqConfigService.host,
      port: this.rabbitmqConfigService.port,
      username: this.rabbitmqConfigService.username,
      password: this.rabbitmqConfigService.password,
    });

    this.channel = await this.connection.createChannel();

    // Assert the exchange and queues
    await this.channel.assertExchange(
      this.rabbitmqConfigService.taskConfig.EXCHANGE,
      this.rabbitmqConfigService.taskConfig.EXCHANGE_TYPE,
      { durable: true },
    );

    for (const queue of Object.values(
      this.rabbitmqConfigService.taskConfig.QUEUES,
    )) {
      await this.channel.assertQueue(queue, { durable: true });
    }

    // Bind queues to the exchange
    for (const [operation, queue] of Object.entries(
      this.rabbitmqConfigService.taskConfig.QUEUES,
    )) {
      const routingKey =
        this.rabbitmqConfigService.taskConfig.ROUTING_KEYS[
          operation.toUpperCase()
        ];
      await this.channel.bindQueue(
        queue,
        this.rabbitmqConfigService.taskConfig.EXCHANGE,
        routingKey,
      );
    }
  }

  /**
   * Consume messages from the queues and process them using the provided callback.
   *
   * @param {Function} callback - The callback function to process the consumed messages.
   */
  async consumeMessages(callback: (content: any) => void) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    for (const [operation, queue] of Object.entries(
      this.rabbitmqConfigService.taskConfig.QUEUES,
    )) {
      await this.channel.consume(queue, async (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());

          callback(content);
          // Acknowledge the message
          this.channel.ack(msg);
        }
      });
    }
  }

  /**
   * Disconnect from RabbitMQ by closing the channel and connection.
   */
  async disconnect() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
