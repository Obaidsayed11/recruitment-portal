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
import { BASE_URL } from "@/config";
import { useParams } from "next/navigation";

interface CompanyData {
  company: {
    name?: string;
    websiteUrl?: string;
    careerPageUrl?: string;
    location?: string;
    logoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    _count?: {
            Department: number,
            Jobs: number,
            Applications: number
        }
  };
}

interface ClientInfoSectionProps {
  companyData: CompanyData | null;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ companyData }) => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<any>({});
   const params = useParams() as { companyId: string};
  const {companyId} = params;

  console.log("companyDataaaaaaaaaaaa",companyData)


  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await apiClient.get<any>(`/analytics/${companyId}`);
          setDashboardData(response?.data?.data || []);
        } catch (error: any) {
          console.error(error.response?.data?.message);
        }
      };
      fetchData();
    }
  }, [session]);

  console.log(dashboardData.jobs,"dasshhh")
  

 
  if (!companyData) {
    return (
      <section className="p-3 bg-secondary border rounded-xl">
        <p className="text-gray-500">No company data available</p>
      </section>
    );
  }

  const { company } = companyData;
  console.log(company,"companyyyyyyyyyyyyyyyyyyyyyy")

 const overViewStats = [
    {
      svg: <ReportsSvg stat />,
      label: "Job Description",
      color: "#FF4560",
      bg: "bg-[#FEF1F3]",
      border: "border-[#FFCDD4]",
      number: dashboardData.jobs ?? "-",
    },
    {
      svg: <DarkStoreSvg stat />,
      label: "Application",
      color: "#FF9C2F",
      bg: "bg-[#FDF2E7]",
      border: "border-[#FFDDB8]",
      number: dashboardData.applications ?? "-",
    },
    {
      svg: <VendorSvg stat />,
      label: "Department",
      color: "#888",
      bg: "bg-[#F1F1F1]",
      border: "border-[#A3A3A3]",
      number: dashboardData.departments ?? "-",
    },
  ];



  return (
    <section className="w-full">
      {/* --- Top Info Section --- */}
     {/* --- Top Info Section --- */}
<div className="border  bg-white rounded-lg p-4 mb-6 flex flex-col lg:flex-row items-center lg:items-stretch gap-4">
  {/* --- Left 50%: Company Info --- */}
  <div className="flex flex-col lg:flex-row items-center lg:items-center w-full lg:w-1/2 gap-6">
    {/* --- Logo & Name --- */}
    <div className="flex items-center gap-3 w-[50%]">
      {company.logoUrl ? (
        <img
         src={`${BASE_URL}${company.logoUrl || "/"}`}
          alt={company.name || "Logo"}
          width={120}
          height={60}
         className="w-[100px] h-[50px] rounded-lg object-contain bg-white border p-1  "
        />
      ) : (
        <div className="w-[120px] h-[60px] bg-gray-400 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
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

    {/* --- Vertical Divider --- */}
<div className="hidden lg:block h-auto w-[1px] bg-gray-300"></div>

    {/* --- Location & Career Page --- */}
    <div className="flex flex-col gap-1 mt-2">
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
  </div>

  {/* --- Vertical Divider between Left and Right halves --- */}
  <div className="hidden lg:block h-auto w-[1px] bg-gray-300"></div>

  {/* --- Right 50%: Stats Cards --- */}
 {/* --- Right Half: Stats Cards --- */}
        <div className="w-full lg:w-1/2 grid grid-cols-3 gap-4">
          {overViewStats.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl border ${card.bg} ${card.border} p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200`}
            >
              {/* Icon on Left */}
              <div
                className="flex items-center justify-center"
                style={{
                  backgroundColor: card.color,
                  borderRadius: "10px",
                  width: "36px",
                  height: "36px",
                  display: "grid",
                  placeContent: "center",
                }}
              >
                <div className="text-white">{card.svg}</div>
              </div>

              {/* Label & Number on Right */}
              <div className="flex flex-col items-start">
                <p className="text-sm text-gray-600">{card.label}</p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: card.color }}
                >
                  {card.number}
                </p>
              </div>
            </div>
          ))}
        </div>
</div>

    </section>
  );
};

export default ClientInfoSection;
