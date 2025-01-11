import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ApiResponse } from "../interfaces/api-response.interface";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        error: null,
        message: "Request successful",
        timestamp: new Date().toISOString(),
        code: context.switchToHttp().getResponse().statusCode,
      })),
    );
  }
}
