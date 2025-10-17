import { BACKEND_URL } from "@/config";

interface PermissionCacheEntry {
  permissions: Set<string>;
  timestamp: number;
}


// In-memory cache (use Redis in production for scalability)
const permissionCache = new Map<string, PermissionCacheEntry>();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getUserPermissions(
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<Set<string>> {
  const cacheKey = `permissions_${userId}`;
  const cached = permissionCache.get(cacheKey);

  // Return cached permissions if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached permissions for user: ${userId}`);
    return cached.permissions;
  }

  console.log(`Fetching fresh permissions for user: ${userId}`);

  try {
    const response = await fetch(`${BACKEND_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Permission API error: ${response.status} ${response.statusText}`
      );
      throw new Error(`Failed to fetch permissions: ${response.status}`);
    }

    const data = await response.json();
    const permissions: any = new Set(
      (data.permissions || []).map((p: any) => p.codename)
    );

    console.log(`Fetched ${permissions.size} permissions for user: ${userId}`);

    // Cache the permissions
    permissionCache.set(cacheKey, {
      permissions,
      timestamp: Date.now(),
    });

    return permissions;
  } catch (error) {
    console.error("Error fetching permissions:", error);

    // Return stale cache if available, otherwise empty set
    if (cached) {
      console.log(`Using stale cached permissions for user: ${userId}`);
      return cached.permissions;
    }

    return new Set<string>();
  }
}

// Clear user permissions from cache (useful on logout or permission updates)
export function clearUserPermissions(userId: string): void {
  const cacheKey = `permissions_${userId}`;
  permissionCache.delete(cacheKey);
  console.log(`Cleared cached permissions for user: ${userId}`);
}

// Clear all cached permissions (useful for maintenance)
export function clearAllPermissions(): void {
  permissionCache.clear();
  console.log("Cleared all cached permissions");
}

// Get cache statistics
export function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  for (const [key, entry] of permissionCache.entries()) {
    if (now - entry.timestamp < CACHE_DURATION) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }

  return {
    totalEntries: permissionCache.size,
    validEntries,
    expiredEntries,
    cacheDurationMinutes: CACHE_DURATION / (60 * 1000),
  };
}
