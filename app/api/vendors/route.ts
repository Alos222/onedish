import { apiMiddleware } from 'src/server/middlewares';
import { LoggerService } from 'src/server/services/logger.service';
import { VendorService } from 'src/server/services/vendor.service';
import { VendorSearchResponse } from 'src/types';

const vendorService = new VendorService();
const logger = new LoggerService('VendorsAPIRoute');

export async function GET(request: Request) {
  return apiMiddleware(logger, request, async () => {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    console.log('searching', { search });

    const data = await vendorService.searchVendors(search);
    const response: VendorSearchResponse = {
      data,
    };
    return response;
  });
}
