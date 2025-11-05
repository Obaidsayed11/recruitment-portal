import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { getUserPermissions } from "./lib/permissionService";

const permissionMap: Record<string, string> = {
  // ============================
  // 📁 COMPANY MODULE
  // ============================
  "^/companies$": "list_companies",
  "^/companies/create-company$": "add_company",
  "^/companies/edit-company/[a-zA-Z0-9-]+$": "edit_company",
  "^/companies/view-company/[a-zA-Z0-9-]+$": "view_company",

  // ============================
  // 🏢 DEPARTMENT MODULE
  // ============================
  "^/departments$": "list_department",
  "^/departments/create-department$": "add_department",
  "^/departments/edit-department/[a-zA-Z0-9-]+$": "edit_department",
  "^/departments/view-department/[a-zA-Z0-9-]+$": "view_department",

  // ============================
  // 💼 JOBS MODULE
  // ============================
  "^/companies/[a-zA-Z0-9-]+/t/jobs$": "list_jobs",
  "^/companies/[a-zA-Z0-9-]+/t/jobs/create-jobs$": "add_job",
  "^/companies/[a-zA-Z0-9-]+/t/jobs/update-jobs/[a-zA-Z0-9-]+$": "edit_job",
  "^/companies/[a-zA-Z0-9-]+/t/jobs/view-jobs/[a-zA-Z0-9-]+$": "view_job",

  // ============================
  // 📄 APPLICATION MODULE
  // ============================
  "^/companies/[a-zA-Z0-9-]+/t/applications$": "list_application",
  "^/companies/[a-zA-Z0-9-]+/t/applications/create-application$": "add_application",
  "^/companies/[a-zA-Z0-9-]+/t/applications/update-application/[a-zA-Z0-9-]+$": "edit_application",
  "^/companies/[a-zA-Z0-9-]+/t/applications/view-application/[a-zA-Z0-9-]+$": "view_application",

  // ============================
  // 👤 USER MODULE
  // ============================
  "^/users$": "list_users",
  "^/users/create-user$": "add_user",
  "^/users/update-user/[a-zA-Z0-9-]+$": "edit_user",
  "^/users/view-user/[a-zA-Z0-9-]+$": "view_user",

  // ============================
  // ⚙️ SETTINGS / GROUPS / ROLES
  // ============================
  "^/settings$": "list_group",
  "^/settings/create-group$": "add_group",
  "^/settings/update-group/[a-zA-Z0-9-]+$": "edit_group_permission",
  "^/settings/roles$": "list_role",
  "^/settings/roles/create-role$": "add_role",
  "^/settings/roles/update-role/[a-zA-Z0-9-]+$": "edit_role",
  "^/settings/permissions$": "view_permission",

  // ============================
  // 📊 ANALYTICS & REPORTS
  // ============================
  "^/analytics$": "view_analytics",
  "^/analytics/global$": "view_global_analytics",
  "^/reports/company$": "view_company_report",
  "^/reports/global$": "view_global_report",

  // ============================
  // 📋 ASSIGNMENTS MODULE
  // ============================
  "^/assignments$": "list_assingment",
  "^/assignments/create-assignment$": "add_assingment",
  "^/assignments/edit-assignment/[a-zA-Z0-9-]+$": "edit_assingment",
  "^/assignments/view-assignment/[a-zA-Z0-9-]+$": "view_assingment",
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const { pathname, origin } = req.nextUrl;

    // --- 1️⃣ Redirect Logic ---
    if (!token) {
      return NextResponse.redirect(new URL("/signin", origin));
    }

    // Redirect authenticated users away from login-related pages
    if (pathname === "/" || pathname === "/signin" || pathname === "/otp") {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }

    // --- 2️⃣ Permission-Based Access Control ---
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
          token.id as string,
          token.accessToken as string,
          token.refreshToken as string
        );

        if (!userPermissions.has(requiredPermission)) {
          console.warn(
            `❌ Access denied for user ${token.id} to ${pathname} (missing ${requiredPermission})`
          );
          return NextResponse.redirect(new URL("/dashboard", origin));
        }
      } catch (err) {
        console.error("Permission check failed:", err);
        return NextResponse.redirect(new URL("/dashboard", origin));
      }
    }

    // --- 3️⃣ Allow Access ---
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
