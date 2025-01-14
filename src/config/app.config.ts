import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get appName(): string {
    return this.configService.get("APP_NAME", "");
  }

  get environment(): string {
    return this.configService.get("NODE_ENV", "development");
  }

  get rateLimitWindowMs(): number {
    return this.configService.get("RATE_LIMIT_WINDOW_MS", 60000);
  }

  get rateLimitMax(): number {
    return this.configService.get("RATE_LIMIT_MAX", 2);
  }
}
