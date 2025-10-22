"use client";
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from "sonner";
import apiClient from "@/lib/axiosInterceptor";
import { useDebounce } from '@/hooks/useDebounce';
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Skeleton2 from "@/components/Others/Skeleton2";
import { Card } from '@/components/ui/card';
import Tabs from '@/components/Others/Tabs';
import Header from "@/components/Others/Header";
import AddUser from "@/components/Modals/AddModals/AddUser";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";
import { useTabContext } from '@/context/TabsContext';

import SettingGroups from './settings/groups/page';
import SettingPermission from './settings/permission/page';
import SettingsMain from './settings/roles/page';
import SettingsRoles from './settings/roles/page';

const Settings = () => {
  const { activeTab, setActiveTab } = useTabContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabs = ["groups", "roles", "permission"];
  
  const tabButtons = [
    { label: "Groups", value: "groups" },
    { label: "Roles", value: "roles" },
    { label: "Permission", value: "permission" }
  ];

  // Sync activeTab with URL and ensure valid tab is set
  useEffect(() => {
    const currentTab = searchParams?.get("tab");
    if (!currentTab || !tabs.includes(currentTab)) {
      // If "tab" is missing or invalid, set it to "groups" in URL
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("tab", "groups");
      router.replace(`?${params.toString()}`, { scroll: false });
      setActiveTab("groups");
    } else {
      setActiveTab(currentTab);
    }
  }, [searchParams, router, setActiveTab]);

  // Handle tab change and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Settings" }]} />

      <div className="grid lg:grid-cols-2 gap-5 col-span-1 lg:col-span-2 rounded-xl h-[calc(100vh-105px)]">
        <div className="flex flex-col w-full">
          {/* Tabs Section */}
          <Tabs
            tabButtons={tabButtons}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="flex justify-start w-full flex-wrap gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6"
          />
          
          {/* Tab Content */}
          <div className="w-full text-center flex justify-start rounded-lg">
            {activeTab === "groups" && <SettingGroups />}
            {activeTab === "roles" && <SettingsRoles />}
            {activeTab === "permission" && <SettingPermission />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;