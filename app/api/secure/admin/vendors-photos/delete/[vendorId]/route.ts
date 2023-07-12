import { NextResponse } from 'next/server';
import { LoggerService } from 'src/server/services/logger.service';
import { AwsService } from 'src/server/services/aws.service';
import { ImageData } from 'src/types';
import { ApiResponse } from 'src/types/response/api-response';
import { DeleteVendorPhotosRequest } from 'src/types/request/vendors/delete-vendor-photos.request';

const logger = new LoggerService('VendorByIdAPIRoute');
const awsService = new AwsService();

export async function DELETE(request: Request, { params }: { params: { vendorId: string } }) {
  const { vendorId } = params;
  try {
    const data = (await request.json()) as DeleteVendorPhotosRequest;

    const promises = data.imageUrls.map(async (url) => {
      return await awsService.deleteVendorPhoto(vendorId, url);
    });
    const successes: boolean[] = await Promise.all(promises);

    const success = successes.every((s) => s);
    const response: ApiResponse<boolean> = {
      data: success,
    };

    return NextResponse.json(response);
  } catch (e) {
    logger.error('Something went wrong deleting images', { err: e, vendorId });
    return NextResponse.json({ error: 'Could not delete images' }, { status: 400 });
  }
}
