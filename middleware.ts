import withAuth from 'next-auth/middleware';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {},
  {
    callbacks: {
      authorized({ req, token }) {
        const { nextUrl } = req;

        // The admin route is the only one that needs auth right now
        if (nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * - auth routes, which are used for setting up authentication
     */
    '/((?!auth|_next/static|favicon.ico|images).*)',
  ],
};
