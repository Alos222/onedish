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
   * Url for where this file is hosted, for example if it comes from Google maps
   */
  url?: string;

  /**
   * File data, if this is a new file upload
   */
  file?: File;

  /**
   * The file data as a string
   */
  fileString?: string;
}
