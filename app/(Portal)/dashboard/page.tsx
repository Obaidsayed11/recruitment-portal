
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
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "@/components/PermissionContext";
import { useRouter } from "next/navigation";

export interface Global {
  applications: number;
  companies: number;
  departments: number;
  jobs: number;
}
interface CompanyOption {
  id: string | any;
  name: string;
}

const AdminDashboardRoute = () => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<Global | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
    const { permissions } = usePermissions();
  // State for the data required for the form (Company/Client list)
    const router = useRouter();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const methods = useForm({
    defaultValues: {
      fromDate: "",
      toDate: "",
      company: "",
    },
  });

  useEffect(() => {
    if (!session) return;
    const fetchCompanies = async () => {
      try {
        const companyRes = await apiClient.get("/company/filter");
        // FIX 1: Correctly accessing the data array based on your API response structure
        setCompanies(companyRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to fetch clients.");
      }
    };
    fetchCompanies();
  }, [session]);

  // const companyId = companies.map((omp) => (omp.id))

  // console.log("companies",companies.map((omp) => (omp.id)))

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
      className2: "bg-[#FF4560] h-[50px] w-[60px] grid place-content-center ",
      className3: "text-[#FF4560]",
      number: dashboardData?.companies ?? "-",
    },
    {
      svg: <ReportsSvg stat />,
      label: "Job Description",
      className: "bg-[#FDF2E7] rounded-[14px] border border-[#FFDDB8]",
      className2: "bg-[#FF9C2F] h-[50px] w-[60px] grid place-content-center",
      className3: "text-[#FF9C2F]",
      number: dashboardData?.jobs ?? "-",
    },
    {
      svg: <DarkStoreSvg stat />,
      label: "Applications",
      className: "bg-[#F1F1F1] rounded-[14px] border border-[#A3A3A3]",
      className2: "bg-[#888] h-[50px] w-[60px] grid place-content-center",
      className3: "text-[#888]",
      number: dashboardData?.applications ?? "-",
    },
    {
      svg: <VendorSvg stat />,
      label: "Departments",
      className: "bg-[#ECF6F4] rounded-[14px] border border-[#A1E0D3]",
      className2: "bg-[#00CFA6] h-[50px] w-[60px] grid place-content-center",
      className3: "text-[#00CFA6]",
      number: dashboardData?.departments ?? "-",
    },
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setError, // Added for potential API validation errors
  } = methods;
  // 🔽 Download report function

  const handleDownload = async () => {
    const { fromDate, toDate, company } = methods.getValues();

    try {
      setIsDownloading(true);
      toast.loading("Preparing your report...", { id: "download-toast" });

      // Build query parameters for dates
      const params = new URLSearchParams();
      if (fromDate) params.append("from", new Date(fromDate).toISOString());
      if (toDate) params.append("to", new Date(toDate).toISOString());

      // Build URL based on whether company is selected
      let url = "";
      if (company && company !== "") {
        // If company is selected, include it in the path
        url = `/report/${company}${
          params.toString() ? `?${params.toString()}` : ""
        }`;
      } else {
        // If no company selected, get all companies data
        url = `/report${params.toString() ? `?${params.toString()}` : ""}`;
      }

      console.log("🔍 Download Request Details:");
      console.log("  - URL:", url);
      console.log("  - From Date:", fromDate);
      console.log("  - To Date:", toDate);
      console.log("  - Company ID:", company || "All Companies");

      // Fetch the report with extended timeout
      const response = await apiClient.get(url, {
        responseType: "blob",
        timeout: 120000, // 2 minutes timeout for large reports
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Download Progress: ${percentCompleted}%`);
            if (percentCompleted % 25 === 0) {
              toast.loading(`Downloading... ${percentCompleted}%`, {
                id: "download-toast",
              });
            }
          }
        },
      });

      if (!response.data || response.data.size === 0) {
        throw new Error(
          "Empty response received from server. No data available for the selected filters."
        );
      }

      // Check if the response is an error message in JSON format
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Failed to generate report");
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Generate filename with date and company info
      const dateStr = new Date().toISOString().split("T")[0];
      const companyName = company
        ? companies
            .find((c) => c.id === company)
            ?.name?.replace(/[^a-z0-9]/gi, "_") || "company"
        : "all-companies";

      // Add date range to filename if provided
      let filename = `report_${companyName}`;
      if (fromDate || toDate) {
        const from = fromDate
          ? new Date(fromDate).toISOString().split("T")[0]
          : "start";
        const to = toDate
          ? new Date(toDate).toISOString().split("T")[0]
          : "end";
        filename += `_${from}_to_${to}`;
      } else {
        filename += `_${dateStr}`;
      }
      filename += ".xlsx";

      link.download = filename;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      console.log("✅ Download initiated:", filename);
      toast.success("Report downloaded successfully!", {
        id: "download-toast",
      });
    } catch (error: any) {
      console.error("❌ Error downloading report:", error);
      console.error("  - Error Code:", error.code);
      console.error("  - Error Message:", error.message);
      console.error("  - Response Status:", error.response?.status);
      console.error("  - Response Data:", error.response?.data);

      let errorMessage = "Failed to download report";

      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        errorMessage =
          "Download timeout. The report is too large. Try:\n• Selecting a smaller date range\n• Selecting a specific company";
      } else if (error.response?.status === 404) {
        errorMessage = "Report endpoint not found. Please contact support.";
      } else if (error.response?.status === 500) {
        errorMessage =
          "Server error while generating report. Please try again.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "Invalid request parameters. Please check your date range.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: "download-toast", duration: 5000 });
    } finally {
      setIsDownloading(false);
    }
  };


      useEffect(() => {
      if (permissions && !hasPermission(permissions, "list_dashboard")) {
        router.push("/dashboard");
      }
    }, [permissions, router])
return (
  <>
    <DynamicBreadcrumb links={[{ label: "Dashboard" }]} />
    <section className="bg-white border border-[#E8E8E8] sm:rounded-xl p-3 sm:p-5 h-[calc(100vh-80px)] sm:h-[calc(100vh-90px)] lg:h-[calc(100vh-105px)] flex flex-col">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-base sm:text-lg font-semibold text-text mb-3 sm:mb-4">
          Overall Stats
        </h2>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6 sm:mb-8">
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

        {/* Download Reports Section */}
        <FormProvider {...methods}>
          <div className="border-t border-gray-200 pt-4 sm:pt-5 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Download Reports
            </h3>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm space-y-4">
              {/* Company Selector - Full Width on Mobile */}
              <div className="w-full">
                <FormField
                  control={control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Companies
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          placeholder="Select Companies"
                          className="w-full"
                          options={[
                            { value: "", label: "All Companies" },
                            ...companies.map((c) => ({
                              value: c.id,
                              label: c.name,
                            })),
                          ]}
                          value={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date Range - Stack on Mobile, Side by Side on Larger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <DateInputField
                  name="fromDate"
                  label="From Date"
                  placeholder="Start date"
                  className="w-full"
                  formLabelClassName="text-sm font-medium text-gray-700"
                />
                <DateInputField
                  name="toDate"
                  label="To Date"
                  placeholder="End date"
                  className="w-full"
                  formLabelClassName="text-sm font-medium text-gray-700"
                />
              </div>

              {/* Download Button - Full Width on Mobile */}
              {hasPermission(permissions, "view_global_report") && (
                <Button
                  type="button"
                  onClick={handleDownload}
                  className="bg-[#00CFA6] text-white hover:bg-[#00b894] px-5 py-2.5 rounded-lg shadow-md transition-all w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </FormProvider>
      </div>
    </section>
  </>
);


};

export default AdminDashboardRoute;
