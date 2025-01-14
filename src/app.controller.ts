import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(public appService: AppService) {}

  @Get("/health-check")
  healthCheck(): string {
    this.appService.getHello();
    return "OK";
  }
}
