import {
  Controller,
  Get,
  UseInterceptors,
  StreamableFile,
  Param,
  Header,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Get('/download/:uuid')
  @UseInterceptors(FileInterceptor('file'))
  async downloadFile(@Param('uuid') uuid: string) {
    const { stream, contentType } = await this.uploadService.download(uuid);
    return new StreamableFile(stream, {
      type: contentType,
    });
  }
}
