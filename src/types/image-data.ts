/**
 * Data for a photo saved into S3
 */
export interface ImageData {
  /**
   * An id created by us used to associate a file saved to S3 with some object created by us
   */
  id: string;

  /**
   * URL to the S3 image
   */
  url: string;
}
