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

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string[] | string =
      'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.';
    const errorName = exception instanceof Error ? exception.name : 'Error';
    const errorMessage = exception instanceof Error ? exception.message : '';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      let originalMessage: string | string[] | undefined;
      if (typeof responseBody === 'string') {
        originalMessage = responseBody;
      } else {
        const body = responseBody as { message?: string | string[] };
        originalMessage = body.message;
      }

      if (exception instanceof NotFoundException) {
        const isDefaultMessage =
          originalMessage === 'Not Found' ||
          (typeof originalMessage === 'string' &&
            originalMessage.startsWith('Cannot GET'));
        message =
          isDefaultMessage || !originalMessage
            ? 'Страница не найдена'
            : originalMessage;
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
    else if (exception instanceof Error && exception.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message =
        'Указан неверный идентификатор, либо страницы больше не существует';
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} — ${errorName}: ${errorMessage}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success: false,
      data: null,
      error: {
        code: errorName,
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
