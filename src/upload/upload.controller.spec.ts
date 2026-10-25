import {
  BadRequestException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'node:stream';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  const uploadService = { download: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: uploadService }],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('отклоняет некорректный идентификатор файла', async () => {
    await expect(controller.downloadFile('../secret')).rejects.toThrow(
      BadRequestException,
    );
    expect(uploadService.download).not.toHaveBeenCalled();
  });

  it('отдаёт изображение inline', async () => {
    uploadService.download.mockResolvedValue({
      stream: Readable.from([]),
      contentType: 'image/webp',
    });

    const result = await controller.downloadFile('file.webp');

    expect(result).toBeInstanceOf(StreamableFile);
    expect(result.getHeaders()).toMatchObject({
      type: 'image/webp',
      disposition: 'inline',
    });
  });

  it('отдаёт не-изображение как attachment', async () => {
    uploadService.download.mockResolvedValue({
      stream: Readable.from([]),
      contentType: 'application/pdf',
    });

    const result = await controller.downloadFile('doc.pdf');

    expect(result.getHeaders()).toMatchObject({
      type: 'application/pdf',
      disposition: 'attachment; filename="doc.pdf"',
    });
  });

  it('пробрасывает NotFoundException из сервиса', async () => {
    uploadService.download.mockRejectedValue(
      new NotFoundException('Файл не найден'),
    );

    await expect(controller.downloadFile('missing.webp')).rejects.toThrow(
      NotFoundException,
    );
  });
});
