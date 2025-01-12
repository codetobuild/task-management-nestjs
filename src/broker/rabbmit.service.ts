import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { RABBITMQ_CONFIG } from "src/common/constants/common.constant";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST || "localhost",
        port: Number(process.env.RABBITMQ_PORT) || 5672,
        username: process.env.RABBITMQ_USER || "guest",
        password: process.env.RABBITMQ_PASSWORD || "guest",
      });
      this.channel = await this.connection.createChannel();
      // Assert exchange
      await this.channel.assertExchange(
        RABBITMQ_CONFIG.EXCHANGE,
        RABBITMQ_CONFIG.EXCHANGE_TYPE,
        { durable: true },
      );
      // Assert queues and bind to the exchange
      for (const [operation, queueName] of Object.entries(
        RABBITMQ_CONFIG.QUEUES,
      )) {
        const routingKey =
          RABBITMQ_CONFIG.ROUTING_KEYS[operation.toUpperCase()];
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.bindQueue(
          queueName,
          RABBITMQ_CONFIG.EXCHANGE,
          routingKey,
        );
      }
    } catch (err) {
      console.error("Failed to initialize RabbitMQ:", err);
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error("Failed to close RabbitMQ connection:", error);
    }
  }
}
