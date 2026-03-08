import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthed = request.cookies.get('site-auth')?.value === 'true';
  const isRootPath = request.nextUrl.pathname === '/';

  // Already authed visiting root → send to /home
  if (isAuthed && isRootPath) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Not authed visiting protected route → send to password gate
  if (!isAuthed && !isRootPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next (static files, images, etc.)
     * - favicon.ico, public assets
     * - API routes
     */
    '/((?!_next|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|api).*)',
  ],
};
