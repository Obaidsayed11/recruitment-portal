// "use client";
// // import { InvardChart } from "@/components/Charts/InvardChart";
// // import { OutwardChart } from "@/components/Charts/Outward";
// // import { ProductAcceptanceMetrics } from "@/components/Charts/ProductAcceptanceMetrics";
// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import apiClient from "@/lib/axiosInterceptor";
// import ClientL2Card from "@/components/Card/ClientL2Card";
// import DarkStoreSvg from "@/components/Svgs/DarkStore";
// import DriversSvg from "@/components/Svgs/DriversSvg";
// import InwardQuantity from "@/components/Card/InwardQuantity";
// import { ProductAcceptanceMetrics } from "@/components/Charts/ProductAcceptanceMetrics";
// import UserSvg from "@/components/Svgs/UserSvg";
// import ProductSvg from "@/components/Svgs/ProductSvg";
// import RestaurantSvg from "@/components/Svgs/RestaurantSvg";
// import VendorSvg from "@/components/Svgs/VendorSvg";
// import { DeliveryTimeChart } from "@/components/Charts/DeliveryTimeChart";
// import { DispatchVolumneChart } from "@/components/Charts/DispatchVolumeChart";
// import { Card } from "@/components/ui/card";
// import Tabs from "@/components/Others/Tabs";
// import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
// import CompanySvg from "@/components/Svgs/CompanySvg";
// import ReportsSvg from "@/components/Svgs/ReportsSvg";

// export interface ClientCardData {
//   svg: React.ReactNode;
//   label: string;
//   number?: string | number;
//   linkColor?: string;
//   text?: string;
//   className?: string;
//   className2?: string;
//   className3?: string;
// }

// export  interface Global {
//   applications : number;
// companies: number; 
// departments: number;
// jobs : number
// }





// const AdminDashboardRoute = () => {
//   const { data: session } = useSession();
//   const [dashboardData, setDashboardData] = useState<Global | null>(null);
//   const tabButtons = [
//     ...Array.from({ length: 20 }, (_, i) => {
//       const num = i + 1;
//       return {
//         label: `Driver ${num}`,
//         value: `DRIVER_${num}`,
//       };
//     }),
//   ];
//   useEffect(() => {
//     if (session) {
//       const fetchData = async () => {
//         try {
//           const response = await apiClient.get<any>(`/analytics`);
//           console.log(response.data.data);
//           setDashboardData(response?.data?.data || []);
        
//         } catch (error: any) {
//           console.error(error.response.data.message);
//         }
//       };
//       fetchData();
//     }
//   }, [session]);
  

//   const overViewStats: ClientCardData[] = [
//   {
//     svg: <CompanySvg stat />,
//     label: "Companies",
//     className: "bg-[#FEF1F3] rounded-[14px] border border-[#FFCDD4]",
//     className2: "bg-[#FF4560] h-[50px] w-[50px] grid place-content-center",
//     className3: "text-[#FF4560]",
//     number: dashboardData?.companies ?? "-",
//   },
//   {
//     svg: <ReportsSvg stat />,
//     label: "Job Description",
//     className: "bg-[#FDF2E7] rounded-[14px] border border-[#FFDDB8]",
//     className2: "bg-[#FF9C2F] h-[50px] w-[50px] grid place-content-center",
//     className3: "text-[#FF9C2F]",
//     number: dashboardData?.jobs ?? "-",
//   },
//   {
//     svg: <DarkStoreSvg stat />,
//     label: "Applications",
//     className: "bg-[#F1F1F1] rounded-[14px] border border-[#A3A3A3]",
//     className2: "bg-[#888] h-[50px] w-[50px] grid place-content-center",
//     className3: "text-[#888]",
//     number: dashboardData?.applications,
//   },
//   {
//     svg: <VendorSvg stat />,
//     label: "Departments",
//     className: "bg-[#ECF6F4] rounded-[14px] border border-[#A1E0D3]",
//     className2: "bg-[#00CFA6] h-[50px] w-[50px] grid place-content-center",
//     className3: "text-[#00CFA6]",
//     number: dashboardData?.departments,
//   },
//   // {
//   //   svg: <DriversSvg stat />,
//   //   label: "Drivers",
//   //   className: "bg-[#E8F5ED] rounded-[14px] border border-[#BDE2CC]",
//   //   className2: "bg-[#119547] h-[50px] w-[50px] grid place-content-center",
//   //   className3: "text-[#119547]",
//   //   number: 16,
//   // },
// ];
//   return (
//     <>
//       <DynamicBreadcrumb links={[{ label: "Dashboard" }]} />
//       <section className="bg-white border border-[#E8E8E8] sm:rounded-xl p-3 sm:p-5">
//         <div className=" h-[calc(100vh-110px)] overflow-auto pr-1">
//           <h2 className="text-base sm:text-lg text-text">Overall Stats</h2>
//           <div className="grid gap-3 md:gap-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 mb-8 mt-2">
//             {overViewStats.map((card, index, dashboardData) => (
//               <ClientL2Card
//                 key={index}
//                 svg={card.svg}
//                 label={card.label}
//                 number={card.number}
//                 className={card.className}
//                 className2={card.className2}
//                 className3={card.className3}
//               />
//             ))}
//           </div>
//           {/* <h2 className="text-base sm:text-lg text-text">
//             Delivery Performance
//           </h2> */}
//           {/* <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_4fr] gap-3 md:gap-5 mb-8 my-2">
//             <ClientL2Card
//               label={"Deliveries"}
//               number={"15"}
//               className="bg-secondary rounded-xl border h-full"
//               className2="bg-[#00CFA6] h-[50px] w-[50px] grid place-content-center"
//               className3="text-[#00CFA6]"
//             />
//             <div className="grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4 items-center px-4  py-4 xl:py-2 rounded-xl border bg-secondary">
//               <h3 className="text-subtext text-base lg:text-lg sm:col-span-2 lg:col-span-3 xl:col-span-1">
//                 Delivery Status
//               </h3>
//               <InwardQuantity
//                 className="border-success"
//                 valueClassName="text-success"
//                 title="Completed"
//                 value={"300"}
//               />
//               <InwardQuantity
//                 className="border-warning"
//                 valueClassName="text-warning"
//                 title="Pending"
//                 value={"300"}
//               />
//               <InwardQuantity
//                 className="border-error"
//                 valueClassName="text-error"
//                 title="Failed"
//                 value={"300"}
//               />
//             </div>
//           </div> */}
//           {/* <h2 className="text-lg text-text">Deliver Efficiency</h2> */}
//       {/* <div className="items-start grid lg:grid-cols-2 gap-5 mb-8 mt-2">
//         <ProductAcceptanceMetrics />
//         <Card className="col-span-1 lg:col-span-2">
//           <div className="">
//             <Tabs tabButtons={tabButtons} />
//           </div>
//         </Card>
//         <DeliveryTimeChart />
//         <DispatchVolumneChart />
//       </div> */}
//         </div>
//       </section>
//     </>
//   );
// };

// export default AdminDashboardRoute;
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/axiosInterceptor";
import ClientL2Card from "@/components/Card/ClientL2Card";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import CompanySvg from "@/components/Svgs/CompanySvg";
import ReportsSvg from "@/components/Svgs/ReportsSvg";
import DarkStoreSvg from "@/components/Svgs/DarkStore";
import VendorSvg from "@/components/Svgs/VendorSvg";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import DateInputField from "@/components/Form_Fields/DateField"; // your shared component
import { toast } from "sonner";

export interface Global {
  applications: number;
  companies: number;
  departments: number;
  jobs: number;
}

const AdminDashboardRoute = () => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<Global | null>(null);
  const methods = useForm({
    defaultValues: {
      fromDate: "",
      toDate: "",
    },
  });

 useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await apiClient.get<any>(`/analytics`);
          console.log(response.data.data);
          setDashboardData(response?.data?.data || []);
        
        } catch (error: any) {
          console.error(error.response.data.message);
        }
      };
      fetchData();
    }
  }, [session]);
  const overViewStats = [
    {
      svg: <CompanySvg stat />,
      label: "Companies",
      className: "bg-[#FEF1F3] rounded-[14px] border border-[#FFCDD4]",
      className2: "bg-[#FF4560] h-[50px] w-[50px] grid place-content-center",
      className3: "text-[#FF4560]",
      number: dashboardData?.companies ?? "-",
    },
    {
      svg: <ReportsSvg stat />,
      label: "Job Description",
      className: "bg-[#FDF2E7] rounded-[14px] border border-[#FFDDB8]",
      className2: "bg-[#FF9C2F] h-[50px] w-[50px] grid place-content-center",
      className3: "text-[#FF9C2F]",
      number: dashboardData?.jobs ?? "-",
    },
    {
      svg: <DarkStoreSvg stat />,
      label: "Applications",
      className: "bg-[#F1F1F1] rounded-[14px] border border-[#A3A3A3]",
      className2: "bg-[#888] h-[50px] w-[50px] grid place-content-center",
      className3: "text-[#888]",
      number: dashboardData?.applications,
    },
    {
      svg: <VendorSvg stat />,
      label: "Departments",
      className: "bg-[#ECF6F4] rounded-[14px] border border-[#A1E0D3]",
      className2: "bg-[#00CFA6] h-[50px] w-[50px] grid place-content-center",
      className3: "text-[#00CFA6]",
      number: dashboardData?.departments,
    },
  ];

  // 🔽 Download report function
  const handleDownload = async () => {
    const { fromDate, toDate } = methods.getValues();

    try {
      const params = new URLSearchParams();
      if (fromDate) params.append("from", new Date(fromDate).toISOString());
      if (toDate) params.append("to", new Date(toDate).toISOString());

      const response = await apiClient.get(`/report${params.toString() ? `?${params}` : ""}`, {
        responseType: "blob", // for file download
      });

      // Download logic
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reports Downloaded Successfully")
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Dashboard" }]} />
      <section className="bg-white border border-[#E8E8E8] sm:rounded-xl p-3 sm:p-5">
        <div className="h-[calc(100vh-110px)] overflow-auto pr-1">
          <h2 className="text-base sm:text-lg text-text mb-2">Overall Stats</h2>

          {/* ✅ Stats Cards */}
          <div className="grid gap-3 md:gap-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 mb-8">
            {overViewStats.map((card, index) => (
              <ClientL2Card
                key={index}
                svg={card.svg}
                label={card.label}
                number={card.number}
                className={card.className}
                className2={card.className2}
                className3={card.className3}
              />
            ))}
          </div>

          
        <FormProvider {...methods}>
  <div className="border-t border-gray-200 mt-6 pt-5">
    <h3 className="text-base font-semibold text-gray-800 mb-3">
      Download Reports
    </h3>

    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Date Inputs */}
      <div className="flex flex-wrap items-end gap-4">
        <DateInputField
          name="fromDate"
          label="From"
          placeholder="Start date"
          className="w-[200px]"
          formLabelClassName="text-sm font-medium text-gray-700"
        />
        <span className="text-gray-500 font-medium">to</span>
        <DateInputField
          name="toDate"
          label="To"
          placeholder="End date"
          className="w-[200px]"
          formLabelClassName="text-sm font-medium text-gray-700"
        />
      </div>

      {/* Download Button */}
      <Button
        type="button"
        onClick={handleDownload}
        className="bg-[#00CFA6] text-white hover:bg-[#00b894] px-5 py-2 rounded-lg shadow-md transition-all"
      >
        Download Report
      </Button>
    </div>
  </div>
</FormProvider>

        </div>
      </section>
    </>
  );
};

export default AdminDashboardRoute;
