import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get appName(): string {
    return this.configService.get("APP_NAME", "");
  }

  get rateLimitWindowMs(): number {
    return this.configService.get("RATE_LIMIT_WINDOW_MS", 60000);
  }

  get rateLimitMax(): number {
    return this.configService.get("RATE_LIMIT_MAX", 2);
  }
}
