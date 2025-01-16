import * as amqp from "amqplib";
import { RabbitMQConfigService } from "src/config";
import { RabbitMQService } from "../rabbitmq.service";
import { Injectable } from "@nestjs/common";

/**
 * TaskConsumer
 *
 * This class is responsible for consuming task-related messages from RabbitMQ.
 * It manages the connection and channel to RabbitMQ and provides methods to connect,
 * consume messages, and disconnect.
 */
@Injectable()
export class TaskConsumer {
  private channel: amqp.Channel;

  constructor(
    private readonly rabbitmqConfigService: RabbitMQConfigService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  /**
   * Establishes a connection to RabbitMQ and creates a channel.
   * Calls the setup method to assert the queues and bindings.
   * @throws Will throw an error if the connection or channel creation fails.
   */
  async connect() {
    this.channel = await this.rabbitmqService.getChannel();
    if (this.channel) {
      await this.setup();
    } else {
      throw new Error("RabbitMQ channel is not initialized");
    }
  }

  /**
   * Sets up the queues and bindings for consuming messages.
   */
  async setup() {
    for (const queue of Object.values(
      this.rabbitmqConfigService.taskConfig.QUEUES,
    )) {
      await this.channel.assertQueue(queue, { durable: true });
    }

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
}
