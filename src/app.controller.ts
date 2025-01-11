import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get("health-check")
  getHealthCheck(): string {
    return "OK";
  }
}
