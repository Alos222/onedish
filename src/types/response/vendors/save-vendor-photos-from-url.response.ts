import { UrlImageData } from 'src/types';

export interface SaveVendorPhotosFromUrlResponse {
  imageData: UrlImageData[];
  vendorImageData?: UrlImageData;
}
