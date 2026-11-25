import {
  BadRequestException,
  Controller,
  Get,
  StreamableFile,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { UploadService } from './upload.service.js';

const FILE_KEY_PATTERN = /^[\w.-]+$/;

// Ключи файлов генерируются — содержимое по ключу не меняется, кэшируем агрессивно
const CACHE_CONTROL = 'public, max-age=2592000, immutable';

@ApiTags('S3')
@Controller('s3')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary:
      'Download file (изображения отдаются inline, документы — attachment)',
  })
  @ApiParam({ name: 'uuid', description: 'Ключ файла в S3' })
  @ApiResponse({
    status: 200,
    description: 'Файл (бинарный поток)',
    headers: {
      'Cache-Control': {
        description: 'Ключи файлов иммутабельны — кэш на 30 дней',
        schema: { type: 'string', example: CACHE_CONTROL },
      },
    },
    content: {
      'application/octet-stream': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @Get('/download/:uuid')
  async downloadFile(
    @Param('uuid') uuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!FILE_KEY_PATTERN.test(uuid)) {
      throw new BadRequestException(['Недопустимый идентификатор файла']);
    }
    const { stream, contentType } = await this.uploadService.download(uuid);
    res.set('Cache-Control', CACHE_CONTROL);
    return new StreamableFile(stream, {
      type: contentType,
      disposition: contentType.startsWith('image/')
        ? 'inline'
        : `attachment; filename="${uuid}"`,
    });
  }
}
