import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // NEVER process NextAuth API routes - let NextAuth handle them completely
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public pages
  if (
    path === "/" ||
    path === "/login" ||
    path === "/signup" ||
    path === "/contact" ||
    path === "/about" ||
    path === "/services" ||
    path === "/terms" ||
    path === "/privacy" ||
    path.startsWith("/products")
  ) {
    return NextResponse.next();
  }

  // For protected routes, check for session
  // Note: We can't access the session directly in middleware, so we'll rely on NextAuth
  // to handle authentication on the protected pages themselves
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes - CRITICAL!)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

