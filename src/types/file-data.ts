/**
 * Contains information about a file data upload
 */
export type FileData = {
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
};
