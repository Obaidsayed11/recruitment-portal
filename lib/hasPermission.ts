// utils/permission.ts

import { Permission } from "@/components/PermissionContext";


export function hasPermission(
  permissions: Permission[],
  codename: string | string[]
): boolean {
  if (!permissions || permissions.length === 0) return false;

  if (Array.isArray(codename)) {
    console.log("codename from utils", codename);

    return codename.some((code) =>
      permissions.some((p) => p.codename === code)
    );
  }
  return permissions.some((p) => p.codename === codename);
}
