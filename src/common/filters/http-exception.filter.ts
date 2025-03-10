import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiResponse } from "../interfaces/api-response.interface";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : "Internal server error";

    const responseBody: ApiResponse<null> = {
      data: null,
      message: message,
      code: status,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }
}
