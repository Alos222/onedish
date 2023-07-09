import { NextResponse } from 'next/server';
import { LoggerService } from 'src/server/services/logger.service';
import { VendorService } from 'src/server/services/vendor.service';
import { AddVendorRequest } from 'src/types/request/vendors/add-vendor.request';
import { AddVendorResponse } from 'src/types/response/vendors/add-vendor.response';

const vendorService = new VendorService();
const logger = new LoggerService('VendorsAPIRoute');

export async function GET(request: Request) {
  return NextResponse.json({ data: 'hello' });
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as AddVendorRequest;

    logger.info('POST vendors', { data });
    await vendorService.addVendor(data.vendor);

    const response: AddVendorResponse = { data: true };
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);

    return NextResponse.json({ error: 'Could not save vendor' }, { status: 400 });
  }
}
