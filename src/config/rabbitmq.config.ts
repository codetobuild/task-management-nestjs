import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RabbitMQConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>("RABBITMQ_HOST", "localhost");
  }

  get port(): number {
    return Number(this.configService.get<number>("RABBITMQ_PORT", 5672));
  }

  get username(): string {
    return this.configService.get<string>("RABBITMQ_USER", "guest");
  }

  get password(): string {
    return this.configService.get<string>("RABBITMQ_PASSWORD", "guest");
  }

  get taskConfig() {
    return {
      EXCHANGE: "task_notifications_exchange",
      QUEUES: {
        CREATE: "task_create_queue",
        UPDATE: "task_update_queue",
        DELETE: "task_delete_queue",
      },
      ROUTING_KEYS: {
        CREATE: "task.create",
        UPDATE: "task.update",
        DELETE: "task.delete",
      },
      EXCHANGE_TYPE: "direct",
    };
  }
}
