import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class S3HealthIndicator {
  private readonly bucket: string;
  private readonly s3Client: S3Client;

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    configService: ConfigService,
  ) {
    this.bucket = configService.getOrThrow('AWS_S3_BUCKET');
    this.s3Client = new S3Client({
      region: configService.getOrThrow('AWS_S3_REGION'),
      endpoint: configService.getOrThrow('AWS_S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_KEY'),
      },
    });
  }

  isHealthy<Key extends string>(key: Key) {
    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        await this.s3Client.send(
          new HeadBucketCommand({ Bucket: this.bucket }),
        );
      })
      .withTimeout(3000);
  }
}
