import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const dashboardRoles: Record<string, string[]> = {
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/sales': ['SALES', 'ADMIN'],
  '/dashboard/sanction': ['SANCTION', 'ADMIN'],
  '/dashboard/disbursement': ['DISBURSEMENT', 'ADMIN'],
  '/dashboard/collection': ['COLLECTION', 'ADMIN'],
};

function getRole(req: NextRequest) {
  return req.cookies.get('role')?.value ?? null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const role = getRole(req);

  if (pathname.startsWith('/borrower') || pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  if (pathname.startsWith('/dashboard')) {
    const allowed = dashboardRoles[pathname];
    if (allowed && !allowed.includes(role ?? '')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if ((pathname === '/auth/login' || pathname === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/borrower/:path*', '/dashboard/:path*', '/auth/:path*'],
};
