import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Response<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; statusCode?: number; };
  meta?: Record<string, unknown>;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, T | Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | Response<T>> {
    const now = new Date();
    return next.handle().pipe(
      map((data) => {
        // Если это поток (StreamableFile), возвращаем его как есть без обертки
        if (data instanceof StreamableFile) {
          return data;
        }
        // В противном случае оборачиваем в объект data
        return {
          success: true,
          data,
          meta: {
            timestamp: now.toISOString(),
            // path: context.switchToHttp().getRequest().url,
          }
        } as Response<T>;
      })
    );
  }
}