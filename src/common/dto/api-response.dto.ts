import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 134, description: 'Всего записей' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Записей на странице' })
  limit: number;

  @ApiProperty({ example: 7, description: 'Номер последней страницы' })
  lastPage: number;
}

export class ResponseMetaDto {
  @ApiProperty({
    example: '2026-10-30T12:00:00.000Z',
    description: 'Время ответа (ISO 8601)',
  })
  timestamp: string;

  @ApiProperty({ example: '/api/hotels?page=1', description: 'Путь запроса' })
  path: string;

  @ApiProperty({ example: 200, description: 'HTTP-статус ответа' })
  statusCode: number;
}

export class ErrorBodyDto {
  @ApiProperty({
    example: 'BadRequestException',
    description: 'Код ошибки (имя исключения)',
  })
  code: string;

  @ApiProperty({
    type: [String],
    example: ['Переданы некорректные данные'],
    description: 'Сообщения об ошибке',
  })
  message: string[];

  @ApiProperty({ example: 400, description: 'HTTP-статус ошибки' })
  statusCode: number;
}

// Формат ошибки AllExceptionsFilter
export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Всегда null при ошибке',
  })
  data: unknown;

  @ApiProperty({ type: () => ErrorBodyDto })
  error: ErrorBodyDto;

  @ApiProperty({ type: () => ResponseMetaDto })
  meta: ResponseMetaDto;
}
