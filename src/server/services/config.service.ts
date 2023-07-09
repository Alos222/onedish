export class ConfigService {
  static appName() {
    return process.env.APP_NAME || 'OneDish';
  }
}
