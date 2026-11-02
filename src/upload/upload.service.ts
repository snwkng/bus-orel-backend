import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'bson';
import sharp from 'sharp';
import { Readable } from 'node:stream';
import * as lookup from 'mime-types';
import { fromBuffer } from 'file-type';
import type {} from 'multer';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const PDF_MIME_TYPE = 'application/pdf';
const DOCX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// file-type не различает doc/xls/ppt внутри OLE2-контейнера — только общий тип
const OLE2_CFB_MIME_TYPE = 'application/x-cfb';
const DOC_MIME_TYPE = 'application/msword';
const DISALLOWED_TYPE_MESSAGE =
  'Недопустимый тип файла. Разрешены: JPEG, PNG, WebP, GIF, AVIF, PDF, DOC, DOCX';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    endpoint: this.configService.getOrThrow('AWS_S3_ENDPOINT'),
    forcePathStyle: true,
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(file: Express.Multer.File) {
    const detected = await fromBuffer(file.buffer);

    let buffer = file.buffer;
    let finalContentType: string;
    let fileName: string;

    if (detected && IMAGE_MIME_TYPES.has(detected.mime)) {
      try {
        buffer = await this.convertToWebP(file.buffer);
        finalContentType = 'image/webp';
        fileName = `${new ObjectId().toString()}.webp`;
      } catch {
        this.logger.warn(
          `Sharp failed to process image: ${file.originalname} (${detected.mime})`,
        );
        throw new BadRequestException(
          'Не удалось обработать изображение. Файл повреждён или имеет неверный формат',
        );
      }
    } else if (
      detected &&
      (detected.mime === PDF_MIME_TYPE || detected.mime === DOCX_MIME_TYPE)
    ) {
      finalContentType = detected.mime;
      fileName = `${new ObjectId().toString()}.${detected.ext}`;
    } else if (
      detected &&
      detected.mime === OLE2_CFB_MIME_TYPE &&
      file.originalname.toLowerCase().endsWith('.doc')
    ) {
      // Legacy .doc: по magic bytes отличить от xls/ppt нельзя, поэтому
      // принимаем OLE2 только с расширением .doc. Риск приемлем —
      // при скачивании такие файлы отдаются как attachment.
      finalContentType = DOC_MIME_TYPE;
      fileName = `${new ObjectId().toString()}.doc`;
    } else {
      // Нет сигнатуры, svg, html, исполняемые файлы и прочее — отклоняем
      throw new BadRequestException(DISALLOWED_TYPE_MESSAGE);
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: buffer,
        ContentType: finalContentType,
      });

      await this.s3Client.send(command);
      return fileName;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${(error as Error).message}`);
      throw new InternalServerErrorException(
        'Ошибка при загрузке файла в хранилище',
      );
    }
  }

  async download(fileName: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });
      const response = await this.s3Client.send(command);
      let contentType = response.ContentType;
      if (!contentType || contentType === 'application/octet-stream') {
        contentType = lookup.lookup(fileName) || 'application/octet-stream';
      }
      return {
        stream: response.Body as Readable,
        contentType,
      };
    } catch (error) {
      if ((error as Error).name === 'NoSuchKey') {
        throw new NotFoundException('Файл не найден');
      }
      this.logger.error(
        `Failed to download file ${fileName}: ${(error as Error).message}`,
      );
      throw new InternalServerErrorException(
        'Ошибка при получении файла из хранилища',
      );
    }
  }

  async delete(fileName: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete file ${fileName}: ${(error as Error).message}`,
      );
      throw new InternalServerErrorException(
        'Ошибка при удалении файла из хранилища',
      );
    }
  }

  async listObjects() {
    try {
      const list = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
        }),
      );
      return list;
    } catch (error) {
      this.logger.error(`Failed to list objects: ${(error as Error).message}`);
      throw new InternalServerErrorException(
        'Ошибка при получении списка файлов из хранилища',
      );
    }
  }

  async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp({ quality: 85 }).toBuffer();
  }
}
