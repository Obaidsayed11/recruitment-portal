import { useState, useEffect } from 'react';
import apiClient from '@/lib/axiosInterceptor';
import { toast } from 'sonner';

// Type definitions
interface Role {
  id: string;
  name: string;
}

interface RolesResponse {
  message: string;
  data: Role[];
}

interface UseRolesReturn {
  roles: Role[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<RolesResponse>('/roles/filter');
      setRoles(response.data.data);
      
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Failed to fetch roles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
};
