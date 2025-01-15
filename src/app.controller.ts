import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(public appService: AppService) {}

  /**
   * Performs a health check on the application.
   *
   * This endpoint is used to verify if the application is running and responsive.
   * It calls the getHello method from the AppService and returns a status string.
   *
   * @returns {string} A string indicating the health status of the application.
   *                   Returns "OK" if the application is healthy and running.
   */
  @Get("/health-check")
  healthCheck(): string {
    this.appService.getHello();
    return "OK";
  }
}
