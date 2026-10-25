import {
  ExceptionFilter,
  Catch,
  HttpException,
  NotFoundException,
  BadRequestException,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string[] | string =
      'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody: any = exception.getResponse();
      const originalMessage =
        typeof responseBody === 'object' ? responseBody.message : responseBody;

      if (exception instanceof NotFoundException) {
        const isDefaultMessage =
          originalMessage === 'Not Found' ||
          (typeof originalMessage === 'string' &&
            originalMessage.startsWith('Cannot GET'));
        message = isDefaultMessage ? 'Страница не найдена' : originalMessage;
      } else if (exception instanceof BadRequestException) {
        message =
          Array.isArray(originalMessage) || originalMessage
            ? originalMessage
            : 'Переданы некорректные данные';
      } else if (originalMessage) {
        message = originalMessage;
      }
    }
    // Обработка специфических ошибок MongoDB (например, битый ID)
    else if (exception.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message =
        'Указан неверный идентификатор, либо страницы больше не существует';
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} — ${exception.name || 'Error'}: ${exception.message ?? ''}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success: false,
      data: null,
      error: {
        code: exception.name || 'Error',
        message: Array.isArray(message) ? message : [message],
        statusCode: status,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        statusCode: status,
      },
    });
  }
}
