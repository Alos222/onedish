import { NextResponse } from 'next/server';
import { LoggerService } from 'src/server/services/logger.service';
import { AwsService } from 'src/server/services/aws.service';
import { ImageData } from 'src/types';
import { ApiResponse } from 'src/types/response/api-response';
import { DeleteVendorPhotosRequest } from 'src/types/request/vendors/delete-vendor-photos.request';

const logger = new LoggerService('VendorByIdAPIRoute');
const awsService = new AwsService();

export async function POST(request: Request, { params }: { params: { vendorId: string } }) {
  const { vendorId } = params;
  try {
    const formData = await request.formData();

    // Upload each file to AWS S3
    const files: { id: string; file: File }[] = [];
    formData.forEach(async (value, key) => {
      files.push({ id: key, file: value as File });
    });

    const promises = files.map(async ({ id, file }) => {
      const url = await awsService.uploadVendorPhotoFile(vendorId, file);
      return {
        id,
        url,
      };
    });
    const s3FileUrls: ImageData[] = await Promise.all(promises);

    const response: ApiResponse<ImageData[]> = {
      data: s3FileUrls,
    };

    return NextResponse.json(response);
  } catch (e) {
    logger.error('Something went wrong uploading photos', { err: e, vendorId });
    return NextResponse.json({ error: 'Could not upload photos' }, { status: 400 });
  }
}