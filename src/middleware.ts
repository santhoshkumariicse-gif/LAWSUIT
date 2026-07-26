import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi'],
  defaultLocale: 'en'
});

const roleHierarchy = {
  USER: 1,
  LAWYER: 2,
  ENTERPRISE_ADMIN: 3,
  SYSTEM_ADMIN: 4,
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Handle Auth for private paths
  if (path.startsWith("/admin") || path.startsWith("/enterprise") || path.startsWith("/dashboard")) {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = (token.role as string) || "USER";
    const roleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;

    if (path.startsWith("/admin") && userRole !== "SYSTEM_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/enterprise") && roleLevel < roleHierarchy.ENTERPRISE_ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Phase 8: Apply next-intl middleware for routing
  const response = intlMiddleware(req);

  // Security Headers
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-192.png).*)']
};
