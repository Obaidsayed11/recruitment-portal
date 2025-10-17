// middleware
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getUserPermissions } from "./lib/permissionService";

// --- Configuration ---

// const permissionMap: Record<string, string> = {
//   // --- ADDED: Dispatcher Permissions ---
//   "^/dispatcher(/[^/]+)?$": "list_shipment",

//   // --- ADDED: Driver Permissions ---
//   "^/driver(/[^/]+)?$": "list_shipment",

//   // --- Outlet User Permissions ---
//   "^/outlet/orders(/[^/]+)?$": "list_order",
//   "^/outlet/tickets(/[^/]+)?$": "list_ticket",

//   // --- SYSTEM ADMIN: High-Level Routes ---
//   "^/admin/clients$": "list_client",
//   "^/admin/clients(/[^/]+)?$": "view_client",
//   "^/admin/groups$": "list_group",
//   "^/admin/groups/(add|update/[^/]+)$": "edit_group_permission",
//   "^/admin/system-settings/create-group$": "edit_group_permission",
//   "^/admin/tickets(/[^/]+)?$": "list_ticket",
//   "^/admin/users(/[^/]+)?$": "view_user",
//   "^/admin/users/create-user$": "create_user",
//   "^/admin/users/update-user/[^/]+$": "edit_user",

//   // --- SYSTEM ADMIN: Tenant-Specific Routes ---
//   "^/admin/t/[^/]+/categories$": "list_category",
//   "^/admin/t/[^/]+/locations$": "list_location",
//   "^/admin/t/[^/]+/products$": "list_product",
//   "^/admin/t/[^/]+/settings/create-group$": "add_group",
//   "^/admin/t/[^/]+/settings/update-group/[^/]+$": "edit_group",
//   "^/admin/t/[^/]+/settings/(create-group|update-group/[^/]+)$":
//     "edit_group_permission",
//   "^/admin/t/[^/]+/users(/[^/]+)?$": "view_user",
//   "^/admin/t/[^/]+/users/create-user$": "create_user",
//   "^/admin/t/[^/]+/users/update-user/[^/]+$": "edit_user",

//   // Tenant Modules
//   "^/admin/t/[^/]+/modules/invisible-delivery/tickets(/[^/]+)?$": "view_ticket",
//   "^/admin/t/[^/]+/modules/lastmile/(create-shipment|update-shipment/[^/]+)$":
//     "configure_shipment",
//   "^/admin/t/[^/]+/modules/lastmile/invoice/[^/]+$": "view_shipment",
//   "^/admin/t/[^/]+/modules/ticket-management/tickets(/[^/]+)?$": "view_ticket",
// };

// --- Middleware Implementation ---

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const origin = req.nextUrl.origin;

    // --- Role and User Info Detection ---
    const userType = token?.userType as string | undefined;
    const isOutletUser = token?.role?.code === "OUTLET_USER";
    const isDispatcher = token?.role?.code === "DISPATCHER";
    const isDriver = token?.role?.code === "DRIVER";
    const userId = token?.id as string;

    // --- Dashboard URL Resolver ---
    const getDashboardUrl = () => {
      if (isOutletUser) return "/outlet";
      if (isDispatcher) return "/dispatcher";
      if (isDriver) return "/driver";
      if (userType === "CLIENT" && token?.clientId) {
        return `/admin/clients/${token.clientId}`;
      }
      if (userType === "SYSTEM" || userType === "INTERNAL") {
        return "/admin/dashboard";
      }
      return "/signin"; // Fallback to signin
    };

    const dashboardUrl = getDashboardUrl();
    const currentPath = pathname;

    // Helper function for redirection
    // 💡 FIX 1: Use an explicit safe path (/unauthorized) for denial redirects 
    // to break potential dashboard loops.
    const redirectUser = (targetPath: string) => {
        // If redirect target is the current path, redirect to /unauthorized to break the loop
        if (targetPath === currentPath) {
             console.error(`Loop detected on path: ${currentPath}. Redirecting to /unauthorized.`);
             return NextResponse.redirect(new URL("/unauthorized", origin));
        }
        return NextResponse.redirect(new URL(targetPath, origin));
    }


    // 1. If authenticated user is on signin page, redirect to their specific dashboard
    if (token && (pathname === "/signin" || pathname === "/otp")) {
      return redirectUser(dashboardUrl);
    }
    
    // 2. Handle root path redirection
    if (pathname === "/") {
      if (token) {
        return redirectUser(dashboardUrl);
      }
      return redirectUser("/signin");
    }

    // 3. Role-Based Route Protection (Prevents users from accessing the wrong top-level section)
    if (token) {
      const isOutletPath = pathname.startsWith("/outlet");
      const isDispatcherPath = pathname.startsWith("/dispatcher");
      const isDriverPath = pathname.startsWith("/driver");
      const isProtectedRoute =
        pathname !== "/otp" && pathname !== "/unauthorized";

      // Deny access if a user is in the wrong top-level section
      if (isOutletPath && !isOutletUser) {
        return redirectUser(dashboardUrl);
      }
      if (isDispatcherPath && !isDispatcher) {
        return redirectUser(dashboardUrl);
      }
      if (isDriverPath && !isDriver) {
        return redirectUser(dashboardUrl);
      }

      // Deny access if a user tries to leave their designated area
      if (isOutletUser && !isOutletPath && isProtectedRoute) {
        return redirectUser(dashboardUrl);
      }
      if (isDispatcher && !isDispatcherPath && isProtectedRoute) {
        return redirectUser(dashboardUrl);
      }
      if (isDriver && !isDriverPath && isProtectedRoute) {
        return redirectUser(dashboardUrl);
      }
    }

    // 4. Granular Permission-Based Access Control
    if (token && pathname !== "/otp" && pathname !== "/unauthorized") {
      let requiredPermission: string | null = null;

      for (const pathRegex in permissionMap) {
        if (new RegExp(pathRegex).test(pathname)) {
          requiredPermission = permissionMap[pathRegex];
          break;
        }
      }

      if (requiredPermission) {
        try {
          const userPermissions = await getUserPermissions(
            userId,
            token.accessToken as string,
            token.refreshToken as string
          );

          if (!userPermissions.has(requiredPermission)) {
            console.log(`Access denied for user ${userId} to ${pathname}`);
            // 💡 FIX 2: Instead of redirecting to the dynamic dashboard (potential loop), 
            // redirect to the static /unauthorized page.
            return redirectUser("/unauthorized"); 
          }
        } catch (error) {
          console.error("Permission check failed:", error);
          // 💡 FIX 3: Catch block redirects to /unauthorized on API error.
          return redirectUser("/unauthorized"); 
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (
          pathname === "/signin" ||
          pathname === "/otp" ||
          pathname === "/unauthorized" // <--- Ensure this is a public path
        ) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};


// next autyh
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/lib/axiosInterceptor";

interface Credentials {
  phone: string;
  otp: string;
  verificationId: string;
}

async function refreshAccessToken(token: any) {
  try {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken: token.refreshToken,
    });

    if (!response.data.accessToken) {
      throw new Error("Failed to refresh token");
    }

    const decodedToken = jwtDecode<{ exp?: number }>(response.data.accessToken);
    if (!decodedToken.exp) {
      throw new Error("No Expiry in decoded token");
    }

    return {
      ...token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken || token.refreshToken,
      accessTokenExpires: decodedToken.exp * 1000,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        verificationId: { label: "Verification ID", type: "text" },
      },

      async authorize(credentials) {
        const { phone, otp, verificationId } = credentials as Credentials;

        try {
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phone);

          const response = await apiClient.post("/auth/login/otp/verify", {
            email: isEmail ? phone : null,
            phone: isEmail ? null : phone,
            otp,
            verificationId,
          });

          const user = response.data.user;

          if (!user) throw new Error("Invalid Phone, OTP, or verificationId");

          return {
            id: user.id,
            fullName: user.fullName,
            clientId: user.clientId,
            userType: user.userType,
            role: user.role,
            accessToken: user.token,
            refreshToken: user.refreshToken,
          };
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.fullName = user.fullName;
        token.clientId = user.clientId;
        token.userType = user.userType;
        token.role = user.role;
        token.id = user.id;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        role: token.role,
        clientId: token.clientId,
        userType: token.userType,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },
  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },

  debug: true,
});

