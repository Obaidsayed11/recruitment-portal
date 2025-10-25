import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

// --- Interfaces for the component (kept same as original) ---
interface CompanyData {
  company: {
    name?: string;
    websiteUrl?: string;
    careerPageUrl?: string;
    location?: string;
    logoUrl?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    Applications?: any[];
    Department?: any[];
    Jobs?: any[];
  };
}

interface ClientInfoSectionProps {
  companyData: CompanyData | null;
}

// --- Helper Component for the Delivery Performance Section ---
const DeliveryStats: React.FC = () => {
  // Hardcoded stats based on the image
  const totalDeliveries = 120;
  const completed = 60;
  const pending = 59;
  const failed = 1;

  // Array for iteration over status cards
  const statusCards = [
    { label: "Completed", value: completed, className: "text-green-600 border-green-400 bg-green-50/50" },
    { label: "Pending", value: pending, className: "text-gray-700 border-gray-300 bg-gray-50/50" },
    { label: "Failed", value: failed, className: "text-red-600 border-red-400 bg-red-50/50" },
  ];

  return (
    <div className="mt-6">
      {/* The 1560 Fill x 80 Hug Tag - centered just above the title */}
      {/* <div className="flex justify-center mb-4">
        <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
          1560 Fill × 80 Hug
        </span>
      </div> */}

      {/* <h3 className="text-gray-700 text-base mb-3 font-medium">Delivery Performance</h3> */}
      {/* <div className="flex gap-4"> */}
        {/* Total Deliveries Card */}
        {/* <div className="p-4 border border-gray-200 rounded-lg w-1/4">
          <p className="text-sm text-gray-500 mb-1">Deliveries</p>
          <strong className="text-3xl font-semibold text-teal-500">{totalDeliveries}</strong>
        </div> */}

        {/* Status Cards (Completed, Pending, Failed) */}
        {/* <div className="flex gap-4 w-3/4">
          {statusCards.map((card) => (
            <div
              key={card.label}
              className={`flex-1 p-4 border rounded-lg transition-shadow duration-300 ${card.className}`}
            >
              <p className="text-sm mb-1">{card.label}</p>
              <strong className="text-xl font-semibold">{card.value}</strong>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

// --- Main Component ---
const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  companyData,
}) => {

  if (!companyData) {
    return (
      <section className="p-3 bg-secondary border rounded-xl">
        <p className="text-gray-500">No company data available</p>
      </section>
    );
  }

  const { company } = companyData;

  // Helper to format date strings (assuming ISO format)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "NA";
    try {
        // Simple way to get YYYY-MM-DD from an ISO string
        return dateString.split("T")[0];
    } catch {
        return dateString; // Fallback if not an ISO string
    }
  };


  // Data structured for the UI grid in the image
  const infoBlocks = [
    // Block 1: Name (used as main) and generic placeholder (sub)
    {
      main: company.name || "Company Name",
      sub: "WH-1234",
    },
    // Block 2: Location (split if possible, otherwise use full location)
    {
      main: company.location?.split(",")[0].trim() || "Location Part 1",
      sub: company.location?.split(",").slice(1).join(", ").trim() || "Location Part 2",
    },
    // Block 3: Simple address detail (using a generic placeholder)
    {
      main: "Shop no. 12, Storia Complex, Worli",
      sub: null,
    },
    // Block 4: Contact/Website
    {
      main: company.websiteUrl ? (
        <a
          href={company.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center group/link"
        >
          {company.websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, '')}
          <ExternalLink className="h-3 w-3 ml-1 opacity-80 group-hover/link:opacity-100" />
        </a>
      ) : "+91 98765 43210", // Placeholder if no website
      sub: "naga.jyoti@gmail.com",
    },
  ];

  return (
    <section className="w-full">
      {/* --- Top Info Box (Mimicking the light blue box) --- */}
      <div className="border border-blue-300 rounded-lg p-3 bg-blue-50/50 mb-6">
        <div className="flex items-center">
          {infoBlocks.map((block, index) => (
            <div
              key={index}
              className={`flex-1 min-w-[150px] p-2 ${
                index < infoBlocks.length - 1 ? "border-r border-gray-300" : ""
              }`}
            >
              <div className={`flex flex-col`}>
                <span className={`text-sm font-medium text-gray-800`}>
                  {block.main}
                </span>
                {block.sub && (
                  <span className={`text-xs text-gray-500 mt-0.5`}>
                    {block.sub}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Timestamps Section - using companyData */}
          <div className="flex-1 min-w-[150px] p-2 ml-auto text-sm">
            <div className="flex flex-col">
                <span className="text-gray-600">
                    <strong className="font-semibold text-gray-700 mr-1">Created at:</strong>
                    {formatDate(company.createdAt)}
                </span>
                <span className="text-gray-600">
                    <strong className="font-semibold text-gray-700 mr-1">Updated at:</strong>
                    {formatDate(company.updatedAt)}
                </span>
            </div>
          </div>
        </div>
      </div>
      {/* --- Delivery Performance Section --- */}
      <DeliveryStats />
    </section>
  );
};

export default ClientInfoSection;