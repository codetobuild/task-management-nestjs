import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { TASK_BROKER_CONFIG } from "../../common/constants";

@Injectable()
export class TaskConsumer {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    this.connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: Number(process.env.RABBITMQ_PORT) || 5672,
      username: process.env.RABBITMQ_USER || "guest",
      password: process.env.RABBITMQ_PASSWORD || "guest",
    });

    this.channel = await this.connection.createChannel();

    // Assert the exchange and queues
    await this.channel.assertExchange(
      TASK_BROKER_CONFIG.EXCHANGE,
      TASK_BROKER_CONFIG.EXCHANGE_TYPE,
      { durable: true },
    );

    for (const queue of Object.values(TASK_BROKER_CONFIG.QUEUES)) {
      await this.channel.assertQueue(queue, { durable: true });
    }

    // Bind queues to the exchange
    for (const [operation, queue] of Object.entries(
      TASK_BROKER_CONFIG.QUEUES,
    )) {
      const routingKey =
        TASK_BROKER_CONFIG.ROUTING_KEYS[operation.toUpperCase()];
      await this.channel.bindQueue(
        queue,
        TASK_BROKER_CONFIG.EXCHANGE,
        routingKey,
      );
    }
  }

  async consumeMessages(callback: (content: any) => void) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    for (const [operation, queue] of Object.entries(
      TASK_BROKER_CONFIG.QUEUES,
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

  async disconnect() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
