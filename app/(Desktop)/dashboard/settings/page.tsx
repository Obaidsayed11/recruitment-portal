
"use client";
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react'

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

import SettingGroups from './groups/page';
import SettingPermission from './permission/page';
import SettingsMain from './roles/page';
import SettingsRoles from './roles/page';


const Settings = () => {

  const { activeTab , setActiveTab} = useTabContext();
  console.log(activeTab)
   useEffect(()=> {
setActiveTab("SettingGroups")
    },[setActiveTab])

const tabButtons = [
  { label: "Groups", value:"SettingGroups"},
    { label: "Roles", value:"SettingsRoles"},
      { label: "Permission", value:"SettingPermission"}
  ];

  return (
  <div>
    
  <h2 className="text-lg font-semibold text-text flex justify-start text-center">Settings</h2>

    <div className="grid lg:grid-cols-2 gap-5 col-span-1 lg:col-span-2 p-6  rounded-xl h-[calc(100vh-105px)] mt-18 ">
    {/* <Card className="col-span-1 lg:col-span-2 p-6 shadow-sm border border-gray-200 rounded-xl h-[calc(100vh-105px)] mt-18"> */}
      {/* Tabs Section */}
      <div className="flex flex-col w-full">
        <Tabs
          tabButtons={tabButtons}
          className="flex justify-start w-full  flex-wrap gap-6 mb-6 "
        />
        {/* Tab Content */}
        {/* <div className="w-full  text-center bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-inner mt-8"> */}
        <div className="w-full  text-center  flex justify-start rounded-lg">
          {activeTab === "SettingGroups" && <SettingGroups />}
          {activeTab === "SettingsRoles" && <SettingsRoles/>}
          {activeTab === "SettingPermission" && <SettingPermission />}
        </div>
      </div>
    {/* </Card> */}
  </div>
</div>

  )
}

export default Settings
