import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect routes that start with /admincu
  if (!pathname.startsWith('/admincu')) {
    return NextResponse.next();
  }

  // ALLOW: /admincu/login (public page - no redirect)
  if (pathname === '/admincu/login') {
    return NextResponse.next();
  }

  // PROTECT: All other /admincu/* routes
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    // No token, redirect to login
    const loginUrl = new URL('/admincu/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token validity
  try {
    const session = await verifyAdminToken(token);
    
    if (!session) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/admincu/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Valid token, add header and continue
    const response = NextResponse.next();
    response.headers.set('x-admin-user', session.username);
    return response;
  } catch (error) {
    console.error('Token verification error:', error);
    const loginUrl = new URL('/admincu/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admincu/:path*',
  ],
};
