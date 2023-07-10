import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

export class AwsService {
  private readonly logger = new LoggerService(this.constructor.name);

  async uploadVendorPhoto(vendorId: string, file: File) {
    this.logger.info('Staring vendor photo upload', { vendorId, fileName: file.name });

    const buffer = await file.arrayBuffer();

    const s3Client = new S3Client({
      region: 'us-east-2',
    });

    const key = `vendor-photos/${vendorId}/${file.name}`;

    const command = new PutObjectCommand({
      Bucket: ConfigService.awsS3BucketName(),
      Key: key,
      Body: new Uint8Array(buffer),
    });
    const result = await s3Client.send(command);

    this.logger.info('Uploaded vendor photo', { vendorId, fileName: file.name, result });
  }
}
