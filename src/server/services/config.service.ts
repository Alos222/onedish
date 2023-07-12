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

  static googleOAuthClientId(): string {
    const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
    if (!GOOGLE_OAUTH_CLIENT_ID) {
      throw new Error('No Google OAuth client id in environment variables!');
    }
    return GOOGLE_OAUTH_CLIENT_ID;
  }

  static googleOAuthClientSecret(): string {
    const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    if (!GOOGLE_OAUTH_CLIENT_SECRET) {
      throw new Error('No Google OAuth client secret in environment variables!');
    }
    return GOOGLE_OAUTH_CLIENT_SECRET;
  }

  static awsS3BucketName(): string {
    const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    if (!AWS_S3_BUCKET_NAME) {
      throw new Error('No AWS S3 bucket name in environment variables!');
    }
    return AWS_S3_BUCKET_NAME;
  }

  static awsS3Region(): string {
    const AWS_S3_REGION = process.env.AWS_S3_REGION;
    if (!AWS_S3_REGION) {
      throw new Error('No AWS S3 region in environment variables!');
    }
    return AWS_S3_REGION;
  }

  static nextAuthSecret(): string {
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
    if (!NEXTAUTH_SECRET) {
      throw new Error('No Next-Auth secret in environment variables!');
    }
    return NEXTAUTH_SECRET;
  }
}
