import { Injectable } from '@nestjs/common';
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
    let fileName = new ObjectId().toString();
    const contentType = lookup.lookup(file.filename) || 'application/octet-stream';
    const mimetype = file.mimetype;
    const currentFileType = file.mimetype.split('/')[1];
    const type = file.originalname.split('.')[1];
    if (mimetype.includes('image')) {
      if (currentFileType == 'svg+xml') {
        fileName = `${fileName}.svg`;
      } else {
        fileName = `${fileName}.webp`;
      }
    } else {
      fileName = `${fileName}.${type}`;
    }
    const buffer =
      mimetype.includes('image') && currentFileType != 'svg+xml'
        ? await this.convertToWebP(file.buffer)
        : file.buffer;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
    return fileName;
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
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: fileName,
        })
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
