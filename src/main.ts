import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { appConfig } from "./config";
import helmet from "helmet";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix(appConfig.API_PREFIX);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(appConfig.SERVER_PORT ?? 3000);
}
bootstrap();
