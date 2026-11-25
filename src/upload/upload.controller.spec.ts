import {
  BadRequestException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'node:stream';
import type { Response } from 'express';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';

describe('UploadController', () => {
  let controller: UploadController;
  const uploadService = { download: vi.fn() };
  const res = { set: vi.fn() } as unknown as Response;

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: uploadService }],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('отклоняет некорректный идентификатор файла', async () => {
    await expect(controller.downloadFile('../secret', res)).rejects.toThrow(
      BadRequestException,
    );
    expect(uploadService.download).not.toHaveBeenCalled();
  });

  it('отдаёт изображение inline', async () => {
    uploadService.download.mockResolvedValue({
      stream: Readable.from([]),
      contentType: 'image/webp',
    });

    const result = await controller.downloadFile('file.webp', res);

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

    const result = await controller.downloadFile('doc.pdf', res);

    expect(result.getHeaders()).toMatchObject({
      type: 'application/pdf',
      disposition: 'attachment; filename="doc.pdf"',
    });
  });

  it('выставляет иммутабельный кэш на 30 дней', async () => {
    uploadService.download.mockResolvedValue({
      stream: Readable.from([]),
      contentType: 'image/webp',
    });

    await controller.downloadFile('file.webp', res);

    expect(res.set).toHaveBeenCalledWith(
      'Cache-Control',
      'public, max-age=2592000, immutable',
    );
  });

  it('пробрасывает NotFoundException из сервиса', async () => {
    uploadService.download.mockRejectedValue(
      new NotFoundException('Файл не найден'),
    );

    await expect(controller.downloadFile('missing.webp', res)).rejects.toThrow(
      NotFoundException,
    );
  });
});
