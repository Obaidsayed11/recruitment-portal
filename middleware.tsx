// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const role = token?.role;
    const pathname = req.nextUrl.pathname;
    const origin = req.nextUrl.origin;
    console.log("Middleware token:", token);


    console.log("🟦 Middleware Running:", pathname);
    console.log("🟢 Token available:", !!token);
    console.log("🧩 Role:", role || "No role");

    // ✅ Allow public page when not authenticated
    if (pathname === "/signin" && !role) {
      console.log("Public access to /signin allowed");
      return NextResponse.next();
    }

    // ✅ Redirect authenticated users away from /signin
    if (pathname === "/signin" && role) {
      const dashboardMap: Record<string, string> = {
        ADMIN: "/dashboard",
       
      };
      const redirectTo = dashboardMap[role] || "/dashboard";
      console.log(`Authenticated user (${role}) redirected to: ${redirectTo}`);
      return NextResponse.redirect(new URL(redirectTo, origin));
    }

    // ✅ Redirect from root `/` based on role
    if (pathname === "/") {
      if (role) {
        const dashboardMap: Record<string, string> = {
          ADMIN: "/dashboard",
         
        };
        const redirectTo = dashboardMap[role] || "/dashboard";
        console.log(`Root redirect: ${role} → ${redirectTo}`);
        return NextResponse.redirect(new URL(redirectTo, origin));
      }
      console.log("Unauthenticated root → redirecting to /signin");
      return NextResponse.redirect(new URL("/signin", origin));
    }

    // ✅ Restrict unauthorized role-based access
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      console.log("Blocked non-admin from /admin");
      return NextResponse.redirect(new URL("/signin", origin));
    }

    
    console.log("✅ Request allowed to proceed:", pathname);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This lets NextAuth decrypt and pass token to middleware
        const isAuth = !!token;
        console.log("🧠 Authorized callback triggered:", isAuth);
        return true; // Always run middleware; handle redirects manually
      },
    },
  }
);


// ✅ Only run on these routes
export const config = {
  matcher: [
    "/",
    "/signin",
    "/admin/:path*",
  ],
};
