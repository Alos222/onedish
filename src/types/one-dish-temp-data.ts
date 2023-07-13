import { OneDish } from '@prisma/client';

/**
 * Temporary data for a OneDish that needs to be have an image uploaded, and save the title and description
 */
export interface OneDishTempData extends Pick<OneDish, 'title' | 'description'> {
  /**
   * Identifier for the file
   */
  id: string;

  /**
   * If this is an already saved OneDish, then this url will point to the image saved in S3
   */
  url?: string;

  /**
   * If this is a file upload from Google maps for example, then this url will be what is used
   *
   * This is to distinguish between a new file to upload to S3, versus a url that we have already saved in S3
   */
  newFileUrl?: string | null;

  /**
   * File data, if this is a new file upload
   */
  fileBlob?: Blob;

  /**
   * Name of the file
   */
  fileName?: string;

  /**
   * The file data as a string
   */
  fileString?: string;
}
