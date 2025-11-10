import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check for admin routes
    if (path.startsWith("/admin") && path !== "/admin/login") {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Check for employee routes
    if (path.startsWith("/employee")) {
      if (token?.role !== "employee" && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Check for platforms route (any authenticated user)
    if (path.startsWith("/platforms")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Check for matrix route (any authenticated user)
    if (path.startsWith("/matrix")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Allow login and signup pages without authentication
        if (path === "/login" || path === "/signup" || path === "/admin/login") {
          return true;
        }

        // Require authentication for protected routes
        if (
          path.startsWith("/admin") ||
          path.startsWith("/employee") ||
          path.startsWith("/platforms") ||
          path.startsWith("/matrix")
        ) {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/platforms/:path*",
    "/matrix/:path*",
    "/login",
    "/signup",
  ],
};

