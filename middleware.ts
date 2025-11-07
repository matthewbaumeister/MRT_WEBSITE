import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow login and admin/login pages without restriction
    if (path === "/login" || path === "/admin/login") {
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
        
        // Always allow login pages
        if (path === "/login" || path === "/admin/login") {
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
  matcher: ["/admin/:path*", "/employee/:path*", "/platforms/:path*", "/login"],
};

