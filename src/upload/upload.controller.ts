import {
  BadRequestException,
  Controller,
  Get,
  StreamableFile,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

const FILE_KEY_PATTERN = /^[\w.-]+$/;

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
    content: {
      'application/octet-stream': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @Get('/download/:uuid')
  async downloadFile(@Param('uuid') uuid: string) {
    if (!FILE_KEY_PATTERN.test(uuid)) {
      throw new BadRequestException(['Недопустимый идентификатор файла']);
    }
    const { stream, contentType } = await this.uploadService.download(uuid);
    return new StreamableFile(stream, {
      type: contentType,
      disposition: contentType.startsWith('image/')
        ? 'inline'
        : `attachment; filename="${uuid}"`,
    });
  }
}
