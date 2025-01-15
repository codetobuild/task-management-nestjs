import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PoolOptions } from "sequelize";

/**
 * DatabaseConfigService
 *
 * This service provides methods to access database configuration settings
 * from environment variables using the ConfigService.
 */
@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get dialect(): string {
    return this.configService.get<string>("DB_DIALECT", "mysql");
  }

  get host(): string {
    return this.configService.get<string>("DB_HOST", "localhost");
  }

  get port(): number {
    return this.configService.get<number>("DB_PORT", 3306);
  }

  get username(): string {
    return this.configService.get<string>("DB_USERNAME", "root");
  }

  get password(): string {
    return this.configService.get<string>("DB_PASSWORD", "");
  }

  get database(): string {
    return this.configService.get<string>("DB_NAME", "task_management_db");
  }

  get logging(): boolean | ((msg: string) => void) {
    return this.configService.get<string>("DB_LOGGING") === "true"
      ? console.log
      : false;
  }

  get pool(): PoolOptions {
    return {
      max: Number(this.configService.get<number>("DB_POOL_MAX", 5)),
      min: Number(this.configService.get<number>("DB_POOL_MIN", 1)),
      acquire: Number(this.configService.get<number>("DB_POOL_ACQUIRE", 30000)),
      idle: Number(this.configService.get<number>("DB_POOL_IDLE", 10000)),
    };
  }
}
