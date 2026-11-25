import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';
import { UploadAdminController } from './upload.admin.controller.js';

@Module({
  controllers: [UploadController, UploadAdminController],
  providers: [UploadService],
})
export class UploadModule {}
