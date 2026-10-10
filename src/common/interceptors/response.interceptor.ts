import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PaginatedResponse, PaginationMetadata } from '../interfaces/pagination.interface';


export interface Response<T> {
  success: boolean;
  data: T; // Убрали опциональность для предсказуемости
  error?: { code: string; message: string; statusCode?: number };
  meta: {
    timestamp: string;
    path: string;
    statusCode: number;
    pagination?: PaginationMetadata;
  };
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T | PaginatedResponse<T>, Response<T | T[]> | StreamableFile>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | PaginatedResponse<T>>,
  ): Observable<Response<T | T[]> | StreamableFile> {
    const now = new Date();
    const http = context.switchToHttp();

    return next.handle().pipe(
      map((res) => {
        if (res instanceof StreamableFile) {
          return res;
        }

        // Type Guard: проверяем, является ли ответ пагинированным
        const isPaginated = (
          obj: T | PaginatedResponse<T>
        ): obj is PaginatedResponse<T> => {
          return !!obj && typeof obj === 'object' && 'items' in obj && 'meta' in obj;
        };

        const responseData = isPaginated(res) ? res.items : res;
        const pagination = isPaginated(res) ? res.meta : undefined;

        return {
          success: true,
          data: responseData,
          meta: {
            timestamp: now.toISOString(),
            path: http.getRequest().url,
            statusCode: http.getResponse().statusCode,
            ...(pagination ? { pagination } : {}),
          },
        };
      }),
    );
  }
}
