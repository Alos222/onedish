export interface ImageDataRequest {
  id: string;
  url: string;
}
export interface SaveVendorPhotosFromUrlRequest {
  imageData: ImageDataRequest[];
  vendorImageData?: ImageDataRequest;
}
