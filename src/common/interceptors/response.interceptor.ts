import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Response<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; statusCode?: number };
  meta?: Record<string, unknown>;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const now = new Date();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        meta: {
          timestamp: now.toISOString(),
          // path: context.switchToHttp().getRequest().url,
        },
      })),
    );
  }
}