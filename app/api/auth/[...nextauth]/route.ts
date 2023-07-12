import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { ConfigService } from 'src/server/services/config.service';
import { LoggerService } from 'src/server/services/logger.service';
import refreshAccessToken from './refreshAccessToken';

const logger = new LoggerService('NextAuth');
const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  secret: ConfigService.nextAuthSecret(),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: ConfigService.googleOAuthClientId(),
      clientSecret: ConfigService.googleOAuthClientSecret(),
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60, // ** 30 days
  },
  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    async jwt({ token, user, account }) {
      logger.info('jwt', { token, user, account });
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + +(account.expires_in || 0) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      logger.info('session', { token, session });
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
