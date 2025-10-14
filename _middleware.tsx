import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    // ✅ Allow access to /signin if the user is not authenticated
    if (pathname === "/signin" && !role) {
      return NextResponse.next(); // Don't redirect, let unauthenticated access signin
    }

    if (pathname === "/signin" && role) {
      const dashboardMap: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        WAREHOUSE: "/warehouse",
        OUTLET: "/outlet",
        DRIVER: "/driver",
        DISPATCHER: "/dispatcher",
      };
      return NextResponse.redirect(new URL(dashboardMap[role] || "/", req.url));
    }

    // ✅ Redirect from root `/` to appropriate dashboard
    if (pathname === "/") {
      if (role === "ADMIN")
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      if (role === "WAREHOUSE")
        return NextResponse.redirect(new URL("/warehouse", req.url));
      if (role === "OUTLET")
        return NextResponse.redirect(new URL("/outlet", req.url));
      if (role === "DRIVER")
        return NextResponse.redirect(new URL("/driver", req.url));
      if (role === "DISPATCHER")
        return NextResponse.redirect(new URL("/dispatcher", req.url));
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // ✅ Restrict unauthorized role-based access
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (pathname.startsWith("/warehouse") && role !== "WAREHOUSE") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (pathname.startsWith("/driver") && role !== "DRIVER") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (pathname.startsWith("/outlet") && role !== "OUTLET") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (pathname.startsWith("/dispatcher") && role !== "DISPATCHER") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next(); // allow the request
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Let the logic above handle redirects
    },
  }
);
export const config = {
  matcher: [
    "/",
    "/signin",
    "/admin/:path*",
    "/warehouse/:path*",
    "/outlet/:path*",
    "/dispatcher/:path*",
  ],
};
