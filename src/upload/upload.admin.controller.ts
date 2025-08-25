import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwr-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminS3')
@Controller('admin/s3')
export class UploadAdminController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const fileName = await this.uploadService.upload(file);
    return fileName;
  }

  @Delete('/delete')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async deleteFile(@Query('uuid') uuid: string) {
    const result = await this.uploadService.delete(uuid);
    return result;
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async getList() {
    const result = await this.uploadService.listObjects();
    return result;
  }
}
