import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import type {} from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FILE_KEY_PATTERN = /^[\w.-]+$/;

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminS3')
@Controller('admin/s3')
export class UploadAdminController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException(['Файл не передан']);
    }
    const fileName = this.uploadService.upload(file);
    return fileName;
  }

  @Delete('/delete')
  deleteFile(@Query('uuid') uuid: string) {
    if (!uuid || !FILE_KEY_PATTERN.test(uuid)) {
      throw new BadRequestException(['Недопустимый идентификатор файла']);
    }
    const result = this.uploadService.delete(uuid);
    return result;
  }

  @Get('/list')
  getList() {
    const result = this.uploadService.listObjects();
    return result;
  }
}
