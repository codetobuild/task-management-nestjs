import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  // Create a new NestJS application instance
  const app: INestApplication = await NestFactory.create(AppModule);

  // Get the ConfigService instance
  const configService: ConfigService = app.get(ConfigService);

  // Use Helmet to enhance API security
  app.use(helmet());

  // Set a global prefix for all routes
  app.setGlobalPrefix(configService.get("API_PREFIX", ""));

  // Use global validation pipe for request validation
  app.useGlobalPipes(new ValidationPipe());

  // Use global exception filter for handling HTTP exceptions
  app.useGlobalFilters(new HttpExceptionFilter());

  // Use Winston logger for logging
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Start the application and listen on the configured port
  await app.listen(configService.get("SERVER_PORT", 3000));
}

// Bootstrap the application
bootstrap();
