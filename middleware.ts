import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // CRITICAL: Always allow NextAuth API routes (must come first!)
    if (path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Allow login, signup, and admin/login pages without restriction
    if (path === "/login" || path === "/signup" || path === "/admin/login") {
      return NextResponse.next();
    }

    // Check admin routes
    const isAdmin = token?.role === "admin";
    const isEmployee = token?.role === "employee";

    if (path.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (path.startsWith("/employee")) {
      if (!isEmployee && !isAdmin) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // CRITICAL: Always allow NextAuth API routes
        if (path.startsWith("/api/auth")) {
          return true;
        }
        
        // Always allow login and signup pages
        if (path === "/login" || path === "/signup" || path === "/admin/login") {
          return true;
        }
        
        // Require authentication for protected routes
        if (
          path.startsWith("/admin") ||
          path.startsWith("/employee") ||
          path.startsWith("/platforms")
        ) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

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

