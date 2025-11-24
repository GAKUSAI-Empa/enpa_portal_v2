import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      (req.nextauth.token as any)?.role_name !== 'ROLE_ADMIN' &&
      (req.nextauth.token as any)?.role_name !== 'ROLE_SUPER_USER'
    )
      return NextResponse.rewrite(
        new URL('/404', req.url), //Not admin, superuser redirect to 404
      );
    if (
      req.nextUrl.pathname.startsWith('/manage') &&
      (req.nextauth.token as any)?.role_name !== 'ROLE_ADMIN' &&
      (req.nextauth.token as any)?.role_name !== 'ROLE_SUPER_USER' &&
      (req.nextauth.token as any)?.role_name !== 'ROLE_MANAGER'
    )
      return NextResponse.rewrite(
        new URL('/404', req.url), // admin, superuser, manager redirect to 404
      );
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, //Redirect to login if user session is unavailable
    },
  },
);

//Access /admin/** and /account/** path required login
export const config = {
  matcher: ['/admin/:path*', '/manage/:path*', '/account/:path*', '/tools/:path*'],
};
