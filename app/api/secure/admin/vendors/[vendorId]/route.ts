import { secureApiMiddleware } from 'src/server/middlewares/secureApiMiddleware';
import { LoggerService } from 'src/server/services/logger.service';
import { VendorService } from 'src/server/services/vendor.service';
import { AddVendorRequest } from 'src/types/request/vendors/add-vendor.request';
import { AddVendorResponse } from 'src/types/response/vendors/add-vendor.response';

const vendorService = new VendorService();
const logger = new LoggerService('VendorByIdAPIRoute');

export async function PATCH(request: Request, { params }: { params: { vendorId: string } }) {
  return secureApiMiddleware(logger, request, async () => {
    try {
      const { vendorId } = params;
      const data = (await request.json()) as AddVendorRequest;

      logger.info('POST vendors', { data });
      await vendorService.updateVendor(vendorId, data.vendor);

      const response: AddVendorResponse = { data: vendorId };
      return response;
    } catch (e) {
      console.error(e);

      return { error: 'Could not upate vendor' };
    }
  });
}
