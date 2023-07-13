import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

export class AwsService {
  private readonly logger = new LoggerService(this.constructor.name);
  private readonly s3Client: S3Client;

  private readonly vendorPhotosKey = 'vendor-photos';

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-2',
    });
  }

  /**
   * Saves a file to AWS S3 in the vendor photos folder
   * @param vendorId The id of the vendor for this photo
   * @param file The file to be saved
   * @returns The S3 url for the saved file
   */
  async uploadVendorPhotoFile(vendorId: string, file: File): Promise<string> {
    this.logger.info('Staring vendor photo upload to AWS S3', { vendorId, fileName: file.name });

    const buffer = await file.arrayBuffer();
    return this.uploadVendorPhoto(vendorId, file.name, new Uint8Array(buffer));
  }

  async uploadVendorPhoto(vendorId: string, fileName: string, buffer: Uint8Array) {
    const key = `${this.vendorPhotosKey}/${vendorId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: ConfigService.awsS3BucketName(),
      Key: key,
      Body: new Uint8Array(buffer),
      Tagging: `${this.getAppTag()}=vendor-photo`,
    });
    const result = await this.s3Client.send(command);

    const statusCode = result.$metadata.httpStatusCode || 0;
    const success = statusCode >= 200 && statusCode <= 299;
    if (!success) {
      this.logger.error('Vendor photo upload to AWS S3 did not have 200 status code', {
        vendorId,
        fileName,
        result,
      });
    }

    const url = `${this.getS3Url()}/${key}`;
    this.logger.info('Finished vendor photo upload to AWS S3', { vendorId, fileName, result, url });

    return url;
  }

  async deleteVendorPhoto(vendorId: string, imageUrl: string): Promise<boolean> {
    this.logger.info('Staring vendor photo delete from AWS S3', { vendorId, imageUrl });

    const s3Url = this.getS3Url();
    const key = imageUrl.replace(`${s3Url}/`, '');

    const command = new DeleteObjectCommand({
      Bucket: ConfigService.awsS3BucketName(),
      Key: key,
    });
    const result = await this.s3Client.send(command);

    const statusCode = result.$metadata.httpStatusCode || 0;
    const success = statusCode >= 200 && statusCode <= 299;
    if (!success) {
      this.logger.error('Vendor photo delete from AWS S3 did not have 200 status code', {
        vendorId,
        result,
      });
    }

    this.logger.info('Finished vendor photo delete from AWS S3', { vendorId, imageUrl, result });

    return success;
  }

  private getS3Url() {
    const awsS3BucketName = ConfigService.awsS3BucketName();
    const awsS3Region = ConfigService.awsS3Region();
    return `https://${awsS3BucketName}.s3.${awsS3Region}.amazonaws.com`;
  }

  private getAppTag() {
    return ConfigService.appName().toLowerCase();
  }
}
