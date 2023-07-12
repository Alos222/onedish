import { JWT } from 'next-auth/jwt';
import { ConfigService } from 'src/server/services/config.service';
import { LoggerService } from 'src/server/services/logger.service';

const logger = new LoggerService('refreshAccessToken');

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
export default async function refreshAccessToken(token: JWT) {
  try {
    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: ConfigService.googleOAuthClientId(),
        client_secret: ConfigService.googleOAuthClientSecret(),
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    logger.error('Error when getting refetch token', { error, token });

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
