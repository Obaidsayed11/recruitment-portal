
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
import JobDescription from './job-descriptions/page';
import Header from "@/components/Others/Header";
import AddUser from "@/components/Modals/AddModals/AddUser";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";
import { useTabContext } from '@/context/TabsContext';
import CompanyApplication from './application/page';
import CompanyDepartment from './department/page';



const Company = () => {

  const { activeTab,setActiveTab } = useTabContext();
  useEffect(()=> {
setActiveTab("Job description")
  },[setActiveTab])
  console.log(activeTab)

const tabButtons = [
    { label: "Job description", value:"Job description"},
     { label: "Application", value:"Application"},
      { label: "Department", value:"Department"}
  ];

  return (
  <div>


    
  <h2 className="text-lg font-semibold text-text flex justify-start text-center">Company</h2>

  <div className="grid lg:grid-cols-2 gap-5 col-span-1 lg:col-span-2 p-6  rounded-xl h-[calc(100vh-105px)] mt-18 ">
    
   
      <div className="flex flex-col w-full">
        
        
        <Tabs
          tabButtons={tabButtons}
          className="flex justify-start w-full  flex-wrap gap-6 mb-6 "
        />

        {/* Tab Content */}
        {/* <div className="w-full  text-center bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-inner mt-8"> */}
           <div className="w-full  text-center  flex justify-start rounded-lg">
          {activeTab === "Job description" && <JobDescription />}
          {activeTab === "Application" && <CompanyApplication />}
          {activeTab === "Department" && <CompanyDepartment />}
        </div>
      </div>
    {/* </Card> */}
  </div>
</div>

  )
}

export default Company
