import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('/download/:uuid')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async downloadFile(@Param('uuid') uuid: string) {
    const type = uuid.split('.')[1];
    let fileType = 'image/webp';
    if (type === 'svg') {
      fileType = 'image/svg+xml';
    } else if (type === 'docx' || type === 'doc') {
      fileType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (type === 'pdf') {
      fileType = 'application/pdf';
    }
    const response = await this.uploadService.download(uuid);
    return new StreamableFile(response, {
      type: fileType,
    });
  }
}
