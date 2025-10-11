import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UploadService {
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
    try {
      let fileName = new ObjectId().toString();
      const mimetype = file.mimetype;
      const currentFileType = file.mimetype.split('/')[1];
      const type = file.originalname.split('.')[1];
      if (mimetype.includes('image')) {
        if (currentFileType != 'svg+xml') {
          fileName = `${fileName}.webp`;
        } else {
          fileName = `${fileName}.svg`;
        }
      } else {
        fileName = `${fileName}.${type}`;
      }
      const buffer =
        mimetype.includes('image') && currentFileType != 'svg+xml'
          ? await this.convertToWebP(file.buffer)
          : file.buffer;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: fileName,
          Body: buffer,
        }),
      );
      return fileName;
    } catch (error) {
      // 
    }
  }

  async download(fileName: string) {
    try {
      const item: any = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: fileName,
        }),
      );
      return item.Body;
    } catch (e) {
      if (e.$metadata.httpStatusCode === 404) {
        throw new NotFoundException({statusMessage: 'Файл не найден'});
      }
      throw e; // Re-throw other errors
    }
  }

  async delete(fileName: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: fileName,
        })
      );
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
          Bucket: this.configService.get('AWS_S3_BUCKET')
        })
      );
      return list;
    } catch (error) {
      console.error(error);
      throw (error);
    }
  }

  async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp({ quality: 100 }).toBuffer();
  }
}
