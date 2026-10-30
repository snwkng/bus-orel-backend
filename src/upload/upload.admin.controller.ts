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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';
import type {} from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FILE_KEY_PATTERN = /^[\w.-]+$/;

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminS3')
@Controller('admin/s3')
export class UploadAdminController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary: 'Upload file (max 5 MB; images are converted to WebP)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JPEG, PNG, WebP, GIF, AVIF, PDF, DOC или DOCX',
        },
      },
    },
  })
  @ApiWrappedResponse(String, {
    status: 201,
    description: 'Имя загруженного файла (ключ в S3)',
  })
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

  @ApiOperation({ summary: 'Delete file by key' })
  @ApiQuery({ name: 'uuid', required: true, description: 'Ключ файла в S3' })
  @ApiWrappedResponse(Boolean, { description: 'true при успешном удалении' })
  @Delete('/delete')
  deleteFile(@Query('uuid') uuid: string) {
    if (!uuid || !FILE_KEY_PATTERN.test(uuid)) {
      throw new BadRequestException(['Недопустимый идентификатор файла']);
    }
    const result = this.uploadService.delete(uuid);
    return result;
  }

  @ApiOperation({ summary: 'List files in bucket' })
  @ApiWrappedResponse(undefined, {
    dataSchema: {
      type: 'object',
      description:
        'Ответ AWS S3 ListObjectsV2: Contents[] (Key, Size, LastModified, ...), IsTruncated, MaxKeys и др.',
    },
  })
  @Get('/list')
  getList() {
    const result = this.uploadService.listObjects();
    return result;
  }
}
