import {
  Controller,
  // Get,
  Query,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('path') path: string,
  ) {
    const newFiles = await this.fileService.filterFiles(files);

    return await this.fileService.saveFiles(newFiles, path);
  }
}
