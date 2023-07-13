import { NextResponse } from 'next/server';

import { secureApiMiddleware } from 'src/server/middlewares/secureApiMiddleware';
import { LoggerService } from 'src/server/services/logger.service';
import { VendorService } from 'src/server/services/vendor.service';
import { AddVendorRequest } from 'src/types/request/vendors/add-vendor.request';
import { AddVendorResponse } from 'src/types/response/vendors/add-vendor.response';
import { VendorPageResponse } from 'src/types/response/vendors/vendor-page.response';

const vendorService = new VendorService();
const logger = new LoggerService('VendorsAPIRoute');

export async function GET(request: Request) {
  return secureApiMiddleware(logger, request, async () => {
    const { searchParams } = new URL(request.url);
    const sortType = searchParams.get('sortType');
    const column = searchParams.get('column') || '';
    const searchQuery = searchParams.get('searchQuery') || '';
    const skip = searchParams.get('skip') || 0;
    const take = searchParams.get('take') || 5;

    const { total, data } = await vendorService.getPaginatedResults(sortType, column, searchQuery, +skip, +take);
    const response: VendorPageResponse = {
      data: {
        data,
        total,
      },
    };
    return response;
  });
}

export async function POST(request: Request) {
  return secureApiMiddleware(logger, request, async () => {
    try {
      const data = (await request.json()) as AddVendorRequest;

      logger.info('POST vendors', { data });
      const vendorId = await vendorService.addVendor(data.vendor);

      const response: AddVendorResponse = { data: vendorId };
      return response;
    } catch (e) {
      logger.error('Could not create vendor', { err: e });
      return { error: 'Could not create vendor' };
    }
  });
}
