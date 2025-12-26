import { ExceptionFilter, Catch, HttpException, NotFoundException, BadRequestException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string[] | string = 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody: any = exception.getResponse();
      const originalMessage = typeof responseBody === 'object'
        ? responseBody.message
        : responseBody;
        
      if (exception instanceof NotFoundException) {
        const isDefaultMessage =
          originalMessage === 'Not Found' ||
          (typeof originalMessage === 'string' && originalMessage.startsWith('Cannot GET'));
        message = isDefaultMessage
          ? 'Страница не найдена'
          : originalMessage;
      }
      else if (exception instanceof BadRequestException) {
        message = Array.isArray(originalMessage)
          ? originalMessage
          : 'Переданы некорректные данные';
      }
      else {
        message = originalMessage;
      }
    }
    // Обработка специфических ошибок MongoDB (например, битый ID)
    else if (exception.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Указан неверный идентификатор, либо страницы больше не существует';
    }

    console.log(message);
    response.status(status).json({
      success: false,
      statusCode: status, // Полезно добавить для фронтенда
      message: Array.isArray(message) ? message : [message],
      error: exception.name || 'Error',
      timestamp: new Date().toISOString(), // Хорошая практика 2025 года
    });
  }
}