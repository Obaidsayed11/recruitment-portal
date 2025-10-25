// "use client";
// import { useSession } from 'next-auth/react';
// import { useParams } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { toast } from "sonner";
// import apiClient from "@/lib/axiosInterceptor";
// import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
// import { Card } from '@/components/ui/card';
// import Tabs from '@/components/Others/Tabs';
// import JobDescription from './job-descriptions/page';
// import { useTabContext } from '@/context/TabsContext';
// import CompanyApplication from './application/page';
// import CompanyDepartment from './department/page';
// import { CompanyProps } from '@/types/companyInterface';
// import ClientInfoSection from '@/components/Card/ClientDetails';

// const Company = () => {
//   const { activeTab, setActiveTab } = useTabContext();
//   const params = useParams<{ companyId: string }>();
//   const companyId = params?.companyId;
//   const { data: session } = useSession();

  
  
//   const [company, setCompany] = useState<CompanyProps | null>(null);
//   const [loading, setLoading] = useState(true);
  

//   useEffect(() => {
//     setActiveTab("Job description");
//   }, [setActiveTab]);

//   // Fetch company details
//   useEffect(() => {
//     if (!session || !companyId) return;

//     const fetchCompanyDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await apiClient.get<CompanyProps>(`/company/${companyId}`);
//         setCompany(response.data);
//         console.log("companyydsdsd",response.data)
//       } catch (error: any) {
//         console.error("Failed to fetch company details:", error);
//         toast.error("Failed to load company details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanyDetails();
//   }, [companyId, session]);

//   console.log("compannnntyyyyyyyyyy:",company)

//   const tabButtons = [
//     { label: "Job description", value: "Job description" },
//     { label: "Application", value: "Application" },
//     { label: "Department", value: "Department" }
//   ];

//   if (loading) {
//     return (
//       <>
//         <DynamicBreadcrumb links={[
//           { label: "Companies", href: "/dashboard/AdminCompanies" },
//           { label: "Loading..." }
//         ]} />
//         <div className="flex items-center justify-center h-[calc(100vh-110px)]">
//           <p className="text-gray-500">Loading company details...</p>
//         </div>
//       </>
//     );
//   }

//   if (!company) {
//     return (
//       <>
//         <DynamicBreadcrumb links={[
//           { label: "Companies", href: "/dashboard/AdminCompanies" },
//           { label: "Not Found" }
//         ]} />
//         <div className="flex items-center justify-center h-[calc(100vh-110px)]">
//           <p className="text-red-500">Company not found</p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <DynamicBreadcrumb links={[
//         { label: "Companies", href: "/dashboard/AdminCompanies" },
//         { label: company.name || "Company Details" }
//       ]} />

//       <div className="grid lg:grid-cols-2 gap-5 col-span-1 lg:col-span-2 rounded-xl h-[calc(100vh-110px)]">
//         <div className="flex flex-col w-full">
//           {/* Company Info Card */}
//           {/* <Card className="p-4 mb-4">
//             <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
//             {company.websiteUrl && (
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium">Website:</span>{" "}
//                 <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                   {company.websiteUrl}
//                 </a>
//               </p>
//             )}
//             {company.description && (
//               <p className="text-sm text-gray-600 mt-2">{company.description}</p>
//             )}
//           </Card> */}
//            <ClientInfoSection companyData={company} />

//           {/* Tabs */}
//           <Tabs
//             tabButtons={tabButtons}
//             className="flex justify-start w-full flex-wrap gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6"
//           />

//           {/* Tab Content */}
//           <div className="w-full text-center flex justify-start rounded-lg">
//             {companyId && (
//               <>
//                 {activeTab === "Job description" && <JobDescription companyId={companyId} />}
//                 {activeTab === "Application" && <CompanyApplication companyId={companyId} />}
//                 {activeTab === "Department" && <CompanyDepartment companyId={companyId} />}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Company;