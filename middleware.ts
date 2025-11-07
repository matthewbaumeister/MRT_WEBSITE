import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect specific admin/employee routes
  // Let everything else through including ALL API routes
  if (path.startsWith("/admin") && path !== "/admin/login") {
    // Check if user has session - redirect to login if not
    // Note: We'll handle this on the page level instead
    return NextResponse.next();
  }

  if (path.startsWith("/employee")) {
    return NextResponse.next();
  }

  if (path.startsWith("/platforms")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on specific protected routes - NOT on api routes!
  matcher: [
    "/admin/:path*",
    "/employee/:path*", 
    "/platforms/:path*",
  ],
};

