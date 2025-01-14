import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { RABBITMQ_CONFIG } from "../../common/constants/common.constant";
import { TaskNotificationMessage } from "../../common/interfaces/taskNotification.interface";

@Injectable()
export class TaskPublisher {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {}

  async connect() {
    this.connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: Number(process.env.RABBITMQ_PORT) || 5672,
      username: process.env.RABBITMQ_USER || "guest",
      password: process.env.RABBITMQ_PASSWORD || "guest",
    });

    this.channel = await this.connection.createChannel();

    // Assert the exchange
    await this.channel.assertExchange(
      RABBITMQ_CONFIG.EXCHANGE,
      RABBITMQ_CONFIG.EXCHANGE_TYPE,
      { durable: true },
    );
  }

  async publish(
    message: TaskNotificationMessage,
    routingKey: string,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(RABBITMQ_CONFIG.EXCHANGE, routingKey, messageBuffer, {
      persistent: true,
    });

    console.log(
      `Message published: ${JSON.stringify(message)} with routingKey: ${routingKey}`,
    );
  }

  async disconnect() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
