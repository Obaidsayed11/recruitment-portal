"use client";
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import apiClient from "@/lib/axiosInterceptor";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import { Card } from '@/components/ui/card';
import Tabs from '@/components/Others/Tabs';
import JobDescription from './company/job-descriptions/page';
import { useTabContext } from '@/context/TabsContext';
import CompanyApplication from './company/application/page';
import CompanyDepartment from './company/department/page';
import { CompanyListProps } from '@/types/companyInterface';
import ClientInfoSection from '@/components/Card/ClientDetails';

const CompanyDetailPage = () => {
  const { activeTab, setActiveTab } = useTabContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams() as { companyId: string };
  const companyId = params.companyId;
  const { data: session } = useSession();
  
  const tabs = ["job-description", "application", "department"];
  
  const [company, setCompany] = useState<CompanyListProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync activeTab with URL and ensure valid tab is set
  useEffect(() => {
    const currentTab = searchParams?.get("tab");
    if (!currentTab || !tabs.includes(currentTab)) {
      // If "tab" is missing or invalid, set it to "job-description" in URL
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("tab", "job-description");
      router.replace(`?${params.toString()}`, { scroll: false });
      setActiveTab("job-description");
    } else {
      setActiveTab(currentTab);
    }
  }, [searchParams, router, setActiveTab]);

  // Fetch company details
  useEffect(() => {
    if (!session || !companyId) return;

    const fetchCompanyDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<CompanyListProps>(`/company/${companyId}`);
        setCompany(response.data);
      } catch (error: any) {
        console.error("Failed to fetch company details:", error);
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId, session]);

  // Handle tab change and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const tabButtons = [
    { label: "Job description", value: "job-description" },
    { label: "Application", value: "application" },
    { label: "Department", value: "department" }
  ];

  if (loading) {
    return (
      <>
        <DynamicBreadcrumb links={[
          { label: "Companies", href: "/dashboard/companies" },
          { label: "Loading..." }
        ]} />
        <div className="flex items-center justify-center h-[calc(100vh-110px)]">
          <p className="text-gray-500">Loading company details...</p>
        </div>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <DynamicBreadcrumb links={[
          { label: "Companies", href: "/dashboard/companies" },
          { label: "Not Found" }
        ]} />
        <div className="flex items-center justify-center h-[calc(100vh-110px)]">
          <p className="text-red-500">Company not found</p>
        </div>
      </>
    );
  }



  return (
    <>
      <DynamicBreadcrumb links={[
        { label: "Companies", href: "/dashboard/companies" },
        { label: company.name || "Company Details" }
      ]} />

      <div className="grid  gap-5 col-span-1 lg:col-span-2 rounded-xl h-[calc(100vh-110px)]">
        <div className="flex flex-col w-full">
          {/* Company Info Card */}
          {/* <Card className="p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
            {company.websiteUrl && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Website:</span>{" "}
                <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company.websiteUrl}
                </a>
              </p>
            )}
            {company.location && (
              <p className="text-sm text-gray-600 mt-2">{company.location}</p>
            )}
          </Card> */}
          <ClientInfoSection companyData={company} />


          {/* Tabs */}
          <Tabs
            tabButtons={tabButtons}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="flex justify-start w-full flex-wrap gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6"
          />

          {/* Tab Content */}
          <div className="w-full text-center flex justify-start rounded-lg">
            {activeTab === "job-description" && <JobDescription companyId={companyId} />}
            {activeTab === "application" && <CompanyApplication companyId={companyId} />}
            {activeTab === "department" && <CompanyDepartment companyId={companyId} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetailPage;