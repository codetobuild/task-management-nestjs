import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ApiResponse } from "../interfaces/api-response.interface";
import { map, Observable } from "rxjs";

/**
 * ResponseInterceptor
 *
 * This interceptor standardizes the structure of the API response.
 * It wraps the original response data in a standardized format that includes
 * additional metadata such as error, message, timestamp, and status code.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  /**
   * Intercept the response and transform it into a standardized format.
   *
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {CallHandler} next - The next handler in the request pipeline.
   * @returns {Observable<ApiResponse<T>>} An observable that emits the transformed response.
   */
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
