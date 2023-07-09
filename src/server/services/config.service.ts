export class ConfigService {
  static appName() {
    return process.env.APP_NAME || 'OneDish';
  }

  static googlePlacesApiKey(): string {
    const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('No Google Places API key in environemnt variables!');
    }
    return GOOGLE_PLACES_API_KEY;
  }
}
