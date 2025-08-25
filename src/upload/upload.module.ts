import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadAdminController } from './upload.admin.controller';

@Module({
  controllers: [UploadController, UploadAdminController],
  providers: [UploadService],
})
export class UploadModule {}
