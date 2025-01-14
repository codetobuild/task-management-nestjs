import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { TaskNotificationMessage } from "../../common/interfaces/taskNotification.interface";
import { RabbitMQConfigService } from "src/config";

@Injectable()
export class TaskPublisher {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly rabbitmqConfigService: RabbitMQConfigService) {}

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

  async disconnect() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
