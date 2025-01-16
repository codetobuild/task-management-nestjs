import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as amqp from "amqplib";
import { RabbitMQConfigService } from "src/config/rabbitmq.config";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private channelInitialized: Promise<void>;

  constructor(private readonly rabbitmqConfigService: RabbitMQConfigService) {}

  async onModuleInit() {
    await this.initializeConnection();
    this.channelInitialized = this.initializeChannel();
    await this.channelInitialized;
  }

  /**
   * Initializes the RabbitMQ connection.
   * @throws Will throw an error if the connection fails.
   */
  private async initializeConnection() {
    this.connection = await amqp.connect({
      hostname: this.rabbitmqConfigService.host,
      port: this.rabbitmqConfigService.port,
      username: this.rabbitmqConfigService.username,
      password: this.rabbitmqConfigService.password,
    });
  }

  /**
   * Initializes the RabbitMQ channel.
   * @throws Will throw an error if the channel creation fails.
   */
  private async initializeChannel() {
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  /**
   * Retrieves the RabbitMQ channel.
   * Ensures that the connection and channel are initialized before returning the channel.
   * @returns {Promise<amqp.Channel>} - The RabbitMQ channel.
   * @throws Will throw an error if the connection or channel initialization fails.
   */
  async getChannel(): Promise<amqp.Channel> {
    if (!this.connection) {
      await this.initializeConnection();
      this.channelInitialized = this.initializeChannel();
    }
    await this.channelInitialized;
    return this.channel;
  }
}
