import {
  Controller,
  Get,
  Query,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('path') path: string,
  ) {
    const newFiles = await this.fileService.filterFiles(files);

    return await this.fileService.saveFiles(newFiles, path);
  }

  @Get('/download')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('file'))
  download(
    @Query('fileName') fileName: string,
    @Query('dir') dir: 'docs' | 'images',
    @Query('type') type: 'excursions' | 'hotels',
  ): StreamableFile {
    const path = join(`public/${dir}/${type}/${fileName}`);
    const file = createReadStream(path);
    return new StreamableFile(file);
  }
}
