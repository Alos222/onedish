export class ConfigService {
  static appName() {
    return process.env.APP_NAME || 'OneDish';
  }

  static googlePlacesApiKey(): string {
    const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('No Google Places API key in environment variables!');
    }
    return GOOGLE_PLACES_API_KEY;
  }

  static awsS3BucketName(): string {
    const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    if (!AWS_S3_BUCKET_NAME) {
      throw new Error('No AWS S3 bucket name in environment variables!');
    }
    return AWS_S3_BUCKET_NAME;
  }
}
