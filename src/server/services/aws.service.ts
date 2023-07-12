import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

export class AwsService {
  private readonly logger = new LoggerService(this.constructor.name);

  private readonly vendorPhotosKey = 'vendor-photos';

  /**
   * Saves a file to AWS S3 in the vendor photos folder
   * @param vendorId The id of the vendor for this photo
   * @param file The file to be saved
   * @returns The S3 url for the saved file
   */
  async uploadVendorPhoto(vendorId: string, file: File) {
    this.logger.info('Staring vendor photo upload to AWS S3', { vendorId, fileName: file.name });

    const buffer = await file.arrayBuffer();

    const s3Client = new S3Client({
      region: 'us-east-2',
    });

    const key = `${this.vendorPhotosKey}/${vendorId}/${file.name}`;

    const command = new PutObjectCommand({
      Bucket: ConfigService.awsS3BucketName(),
      Key: key,
      Body: new Uint8Array(buffer),
      Tagging: `${ConfigService.appName()}=vendor-photo`,
    });
    const result = await s3Client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
      this.logger.error('Vendor photo upload to AWS S3 did not have 200 status code', {
        vendorId,
        fileName: file.name,
        result,
      });
    }

    const url = `${this.getS3Url()}/${key}`;
    this.logger.info('Finished vendor photo upload to AWS S3', { vendorId, fileName: file.name, result, url });

    return url;
  }

  private getS3Url() {
    const awsS3BucketName = ConfigService.awsS3BucketName();
    const awsS3Region = ConfigService.awsS3Region();
    return `https://${awsS3BucketName}.s3.${awsS3Region}.amazonaws.com`;
  }
}
