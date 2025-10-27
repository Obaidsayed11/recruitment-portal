"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import apiClient from "@/lib/axiosInterceptor";
import { useSession } from "next-auth/react";
import CompanySvg from "../Svgs/CompanySvg";
import ReportsSvg from "../Svgs/ReportsSvg";
import DarkStoreSvg from "../Svgs/DarkStore";
import VendorSvg from "../Svgs/VendorSvg";
import ClientL2Card from "./ClientL2Card";

interface CompanyData {
  company: {
    name?: string;
    websiteUrl?: string;
    careerPageUrl?: string;
    location?: string;
    logoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface ClientInfoSectionProps {
  companyData: CompanyData | null;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ companyData }) => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await apiClient.get<any>(`/analytics`);
          setDashboardData(response?.data?.data || []);
        } catch (error: any) {
          console.error(error.response?.data?.message);
        }
      };
      fetchData();
    }
  }, [session]);

  const overViewStats = [
    {
      
      label: "Companies",
      className: "bg-[#FEF1F3] border border-[#FFCDD4]",
      className2: "bg-[#FF4560] h-[36px] w-[36px] grid place-content-center rounded-lg",
      className3: "text-[#FF4560]",
      number: dashboardData?.companies ?? "-",
    },
    {
    
      label: "Job Description",
      className: "bg-[#FDF2E7] border border-[#FFDDB8]",
      className2: "bg-[#FF9C2F] h-[36px] w-[36px] grid place-content-center rounded-lg",
      className3: "text-[#FF9C2F]",
      number: dashboardData?.jobs ?? "-",
    },
    {
      
      label: "Applications",
      className: "bg-[#F1F1F1] border border-[#A3A3A3]",
      className2: "bg-[#888] h-[36px] w-[36px] grid place-content-center rounded-lg",
      className3: "text-[#888]",
      number: dashboardData?.applications ?? "-",
    },
  ];

  if (!companyData) {
    return (
      <section className="p-3 bg-secondary border rounded-xl">
        <p className="text-gray-500">No company data available</p>
      </section>
    );
  }

  const { company } = companyData;

  return (
    <section className="w-full">
      {/* --- Top Info Section --- */}
      <div className="border border-[#A3A3A3] bg-secondary rounded-lg p-4 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        {/* --- Column 1: Logo, Name, Website --- */}
        <div className="flex items-center gap-3">
          {company.logoUrl ? (
            <Image
              src={company.logoUrl}
              alt={company.name || "Logo"}
              width={60}
              height={60}
              className="rounded-lg object-contain bg-white border w-[60px] h-[60px]"
            />
          ) : (
            <div className="w-[60px] h-[60px] bg-gray-400 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
              {company.name?.charAt(0).toUpperCase() || "N"}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-800 text-lg">{company.name || "Company Name"}</h3>
            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                {company.websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, "")}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* --- Column 2: Location + Career URL --- */}
        <div className="flex flex-col gap-1">
          <p className="text-gray-700 text-sm">
            <strong>Location:</strong> {company.location || "Not available"}
          </p>
          {company.careerPageUrl && (
            <a
              href={company.careerPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
            {company.careerPageUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* --- Column 3: Compact Stats Cards --- */}
        <div className="grid grid-cols-3 gap-2">
          {overViewStats.map((card, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg border text-center text-xs ${card.className}`}
            >
            
              <div className="text-[10px] text-gray-500 mt-0.5">{card.label}</div>
              <div className={`font-semibold ${card.className3}`}>{card.number}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientInfoSection;
