import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get("REDIS_HOST") || "localhost";
  }

  get port(): number {
    return parseInt(this.configService.get("REDIS_PORT"), 10) || 6379;
  }

  get password(): string {
    return this.configService.get("REDIS_PASSWORD") || "";
  }

  get username(): string {
    return this.configService.get("REDIS_USERNAME") || "";
  }

  get db(): number {
    return this.configService.get<number>("REDIS_DB", 0);
  }

  get connectionType(): string {
    return this.configService.get("REDIS_CONNECTION_TYPE") || "single";
  }
}
