import { NextResponse } from 'next/server';
import { LoggerService } from 'src/server/services/logger.service';
import { AwsService } from 'src/server/services/aws.service';

const logger = new LoggerService('VendorByIdAPIRoute');
const awsService = new AwsService();

export async function POST(request: Request, { params }: { params: { vendorId: string } }) {
  const { vendorId } = params;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    awsService.uploadVendorPhoto(vendorId, file);

    return NextResponse.json({ success: false });
  } catch (e) {
    logger.error('Something went wrong uploading photo', { err: e, vendorId });

    return NextResponse.json({ error: 'Could not upload photo' }, { status: 400 });
  }
}
