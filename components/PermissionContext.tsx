"use client";

import apiClient from "@/lib/axiosInterceptor";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Permission = {
  id: string;
  codename: string;
  name: string;
};

export type PermissionContextType = {
  permissions: Permission[];
  data: any;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [data, setData] = useState<any>(null); // Initial state as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/me`);
      if (res.status !== 200) throw new Error("Failed to fetch permissions");
      const responseData = res.data;
      console.log("permission laaloo", responseData);

      setData(responseData);
      setPermissions(responseData.permissions || []); // Fallback to empty array
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // **THE FIX IS HERE**
  const { status } = useSession(); // 1. Get the stable `status` string instead of the whole session object.

  useEffect(() => {
    // 2. Only fetch permissions when the user is actually authenticated.
    if (status === "authenticated") {
      fetchPermissions();
    }
    // If the user logs out, you might want to clear the data.
    if (status === "unauthenticated") {
      setPermissions([]);
      setData(null);
      setLoading(false);
    }
  }, [status]); // 3. Depend on the stable `status` string. This breaks the loop.

  return (
    <PermissionContext.Provider
      value={{ data, permissions, loading, error, reload: fetchPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};
