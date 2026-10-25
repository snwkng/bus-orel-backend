import {
  BadRequestException,
  Controller,
  Get,
  StreamableFile,
  Param,
} from '@nestjs/common';
import { UploadService } from './upload.service';

const FILE_KEY_PATTERN = /^[\w.-]+$/;

@Controller('s3')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
