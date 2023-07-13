import axios from 'axios';
import { LoggerService } from 'src/server/services/logger.service';
import { AwsService } from 'src/server/services/aws.service';
import { ApiResponse } from 'src/types/response/api-response';
import { SaveVendorPhotosFromUrlRequest } from 'src/types';
import { UrlImageData } from 'src/types';
import { secureApiMiddleware } from 'src/server/middlewares/secureApiMiddleware';
import { SaveVendorPhotosFromUrlResponse } from 'src/types/response/vendors/save-vendor-photos-from-url.response';

const logger = new LoggerService('VendorByIdAPIRoute');
const awsService = new AwsService();

export async function POST(request: Request, { params }: { params: { vendorId: string } }) {
  return secureApiMiddleware(logger, request, async () => {
    const { vendorId } = params;
    try {
      const data = (await request.json()) as SaveVendorPhotosFromUrlRequest;

      const promises = data.imageData.map(async ({ id, url }) => {
        const response = await axios({
          url,
          responseType: 'arraybuffer',
        });
        const imageData = Buffer.from(response.data, 'binary');
        // TODO Should we save as .png or something else?
        const s3Url = await awsService.uploadVendorPhoto(vendorId, `${id}.png`, imageData);
        return {
          id,
          url: s3Url,
        };
      });

      const s3FileUrls: UrlImageData[] = await Promise.all(promises);

      const responseData: SaveVendorPhotosFromUrlResponse = { imageData: s3FileUrls };

      if (data.vendorImageData?.url) {
        const response = await axios({
          url: data.vendorImageData.url,
          responseType: 'arraybuffer',
        });
        const vendorImageData = Buffer.from(response.data, 'binary');
        const s3Url = await awsService.uploadVendorPhoto(vendorId, `${vendorId}.png`, vendorImageData);
        responseData.vendorImageData = {
          id: data.vendorImageData.id,
          url: s3Url,
        };
      }

      const response: ApiResponse<SaveVendorPhotosFromUrlResponse> = {
        data: responseData,
      };
      return response;
    } catch (e) {
      logger.error('Something went wrong uploading photos', { err: e, vendorId });
      return { error: 'Could not upload photos' };
    }
  });
}
