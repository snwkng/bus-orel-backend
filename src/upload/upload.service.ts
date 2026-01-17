import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'bson';
import * as sharp from 'sharp';
import { Readable } from 'node:stream';
import * as lookup from 'mime-types';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    endpoint: this.configService.getOrThrow('AWS_S3_ENDPOINT'),
    forcePathStyle: true,
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) { }

  async upload(file: Express.Multer.File) {
    const originalMime = lookup.lookup(file.originalname) || 'application/octet-stream';
    const isImage = originalMime.includes('image') && !originalMime.includes('svg');

    let buffer = file.buffer;
    let finalContentType = originalMime;
    const extension = file.originalname.split('.').pop() || '';
    let fileName = `${new ObjectId().toString()}.${extension}`;


    if (isImage) {
      // Пытаемся конвертировать
      try {
        buffer = await this.convertToWebP(file.buffer);
        finalContentType = 'image/webp';
        fileName = `${new ObjectId().toString()}.webp`;
      } catch (error) {
        // Если файл битый или sharp не справился — не паникуем
        this.logger.warn(`Sharp failed to process image, uploading original: ${file.originalname}`);
      }
    } else {
      buffer = file.buffer;
      fileName = `${new ObjectId().toString()}.${extension}`;
      finalContentType = originalMime;
    }



    console.log(this.bucket);
    console.log(fileName);
    console.log(finalContentType);
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
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw new InternalServerErrorException('Ошибка при загрузке файла в хранилище');
    }

  }

  async download(fileName: string) {
    const command = new GetObjectCommand({ Bucket: this.configService.get('AWS_S3_BUCKET'), Key: fileName });
    const response = await this.s3Client.send(command);
    let contentType = response.ContentType;
    if (!contentType || contentType === 'application/octet-stream') {
      contentType = lookup.lookup(fileName) || 'application/octet-stream';
    }
    return {
      stream: response.Body as Readable,
      contentType,
    };
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
      console.error(error);
      throw (error);
    }
  }

  async listObjects() {
    try {
      const list = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket
        })
      );
      return list;
    } catch (error) {
      console.error(error);
      throw (error);
    }
  }

  async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp({ quality: 85 }).toBuffer();
  };
}
