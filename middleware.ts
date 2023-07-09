import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
// import { localhostAccessTokenRedirectMiddleware } from 'src/server/middlewares/appMiddlewares/localhostAccessTokenRedirectMiddleware';
// import { secureApiMiddleware } from 'src/server/middlewares/appMiddlewares/secureApiMiddleware';
// import { securePageMiddleware } from 'src/server/middlewares/appMiddlewares/securePageMiddleware';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (request.nextUrl.pathname.startsWith('/api/secure')) {
      // return secureApiMiddleware(request, event);
    }
    return NextResponse.next();
  }

  // return securePageMiddleware(request, event);
  return NextResponse.next();
}

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