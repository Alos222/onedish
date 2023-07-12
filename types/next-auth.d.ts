import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultSession['user'] {
    test: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;

    accessToken?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User | AdapterUser;

    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
