import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import sharp from 'sharp';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  const configService = {
    get: jest.fn().mockReturnValue('test-value'),
    getOrThrow: jest.fn().mockReturnValue('test-value'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  describe('upload', () => {
    it('отклоняет файл без известной сигнатуры', async () => {
      const file = {
        buffer: Buffer.from('<html><body>xss</body></html>'),
        originalname: 'page.html',
      } as Express.Multer.File;

      await expect(service.upload(file)).rejects.toThrow(BadRequestException);
    });

    it('конвертирует изображение в WebP и загружает в S3', async () => {
      const png = await sharp({
        create: {
          width: 4,
          height: 4,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer();
      const send = jest
        .spyOn(service['s3Client'], 'send')
        .mockResolvedValue({} as never);

      const fileName = await service.upload({
        buffer: png,
        originalname: 'photo.png',
      } as Express.Multer.File);

      expect(fileName).toMatch(/^[a-f0-9]{24}\.webp$/);
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({ ContentType: 'image/webp' }),
        }),
      );
    });

    it('принимает PDF без конвертации', async () => {
      const pdf = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF',
      );
      jest.spyOn(service['s3Client'], 'send').mockResolvedValue({} as never);

      const fileName = await service.upload({
        buffer: pdf,
        originalname: 'doc.pdf',
      } as Express.Multer.File);

      expect(fileName).toMatch(/^[a-f0-9]{24}\.pdf$/);
    });
  });

  describe('download', () => {
    it('бросает NotFoundException при отсутствии файла в S3', async () => {
      jest.spyOn(service['s3Client'], 'send').mockRejectedValue(
        Object.assign(new Error('The specified key does not exist.'), {
          name: 'NoSuchKey',
        }) as never,
      );

      await expect(service.download('missing.webp')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
