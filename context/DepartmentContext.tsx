"use client";
import React, { createContext, useContext, useState } from "react";
import apiClient from "@/lib/axiosInterceptor";
import { useParams } from "next/navigation";

interface Department {
  
  id: number;
  name: string;
  description: string;
}

interface DepartmentContextType {
  departments: Department[];
  loading: boolean;
  fetchDepartments: (companyId: number | string) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
   const params = useParams() as { companyId: string };
  const companyId = params.companyId;

  const fetchDepartments = async (companyId: number | string) => {
    if (!companyId) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/departments`, {
        params: { companyId },
      });
      setDepartments(response.data.departments || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentContext.Provider value={{ departments, loading, fetchDepartments }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (!context) throw new Error("useDepartments must be used within a DepartmentProvider");
  return context;
};
