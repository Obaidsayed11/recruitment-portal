"use client";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import apiClient from "@/lib/axiosInterceptor";
import { CompanyProps, CompanyListProps } from "@/types/companyInterface";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Operations from "@/components/Others/Operations";
import Skeleton2 from "@/components/Others/Skeleton2";
import Header from "@/components/Others/Header";
import AddCompany from "@/components/Modals/AddModals/AddCompany";
import CompanyCard from "@/components/Card/CompanyCard";
import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "@/components/PermissionContext";

import BulkAddModal from "@/components/Others/BulkAddModal";

const headersOptions = [
  { value: "Company" },

  { value: "Career Page" },
  { value: "Address" },
  { value: "Description" },
  { value: "Actions" },
];

const CompanyRoute = ({
 
}) => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { permissions } = usePermissions();

  const [allCompanies, setAllCompanies] = useState<CompanyProps[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [serverSearchQuery, setServerSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(serverSearchQuery, 500);
  const selectedRole = searchParams?.get("role") || "";
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const allCards = useMemo(() => allCompanies.map((c) => c.id), [allCompanies]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCompanyRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setAllCompanies([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearchQuery, selectedRole]);

  useEffect(() => {
    const PAGE_SIZE = 20;

    // Guard clause to prevent fetching if not ready.
    if (!session) {
      return;
    }

    const fetchData = async () => {
      if (!session || (page > 1 && !hasMore)) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", PAGE_SIZE.toString());
        let url: string;
        if (debouncedSearchQuery) {
          const params = new URLSearchParams();
          params.append("query", debouncedSearchQuery);

          url = `/company/search?${params.toString()}`;
        } else {
          if (selectedRole && selectedRole !== "All") {
            params.append("role", selectedRole);
          }
          url = `/company`;
        }
        const response = await apiClient.get<CompanyListProps>(url);
        const newCompanies = response.data.companies.map((company: any) => ({
          ...company,
        }));

        if (page === 1) setAllCompanies(newCompanies);
        else setAllCompanies((prev) => [...prev, ...newCompanies]);

        const currentPage = response.data.page || page;
        const totalPages = response.data.totalPages || 1;
        setHasMore(currentPage < totalPages);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to fetch companies");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, debouncedSearchQuery, session]);

  const handleSelectAll = (checked: boolean) =>
    setSelectedCards(checked ? allCards : []);

  const handleCardSelect = (id: string, checked: boolean) =>
    setSelectedCards((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );

  const handleDelete = (id: string) =>
    setAllCompanies((prev) => prev.filter((c) => c.id !== id));

  const handleAdd = (newData: CompanyProps) => {
    if (newData) setAllCompanies((prev) => [newData, ...prev]);
  };

  const handleUpdate = (updatedData: CompanyProps) => {
    if (updatedData)
      // setAllCompanies((prev) =>
      //   prev.some((c) => c.id === updatedData.id)
      //     ? prev.map((c) => (c.id === updatedData.id ? updatedData : c))
      //     : [updatedData, ...prev]
      // );

      setAllCompanies((prev) =>
        prev.map((data) => (data.id === updatedData.id ? updatedData : data))
      );
  };
 
  const handleDeleteSelected = async () => {
    if (selectedCards.length > 0) {
      try {
        const response = await apiClient.delete("/company/bulk", {
          data: { ids: selectedCards },
        });
        toast.success(response.data.message);
        setAllCompanies((prevData) =>
          prevData.filter((data) => !selectedCards.includes(data.id))
        );
        setSelectedCards([]);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete selected locations"
        );
        console.error("Delete error:", error);
      }
    }
  };

  // NEW: Handle company click to navigate to detail page
  const handleCompanyClick = (companyId: string) => {
    router.push(`/companies/${companyId}`);
  };

  useEffect(() => {
    if (permissions && !hasPermission(permissions, "list_companies")) {
      router.push("/companies");
       toast.error("You do not have permission to view company list.");
    }
  }, [permissions, router]);


// bulk data 

    const handleBulkUpload = (newBulkData: any[]) => {
    if (newBulkData && newBulkData.length > 0) {
      setAllCompanies((prevData) => [...newBulkData, ...prevData]);
      toast.success(`${newBulkData.length} new companies added successfully!`);
    } else {
      toast.error("Bulk upload failed or returned no new data.");
    }
  };

  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Companies" }]} />
      <section className="bg-white sm:rounded-xl p-3 sm:p-5 h-[calc(100vh-110px)] flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center  xl:justify-between gap-3 sm:gap-4 pb-5 sm:flex-wrap lg:flex-nowrap">
          <Operations
           
            checkBox
            isAllSelected={
              allCards.length > 0 && selectedCards.length === allCards.length
            }
            selectedCount={selectedCards.length}
            handleSelectAll={handleSelectAll}
            
            onDeleteSelected={handleDeleteSelected}
            searchQuery={searchQuery}
            handleSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            serverSearchQuery={serverSearchQuery}
            handleServerSearchQueryChange={(e) =>
              setServerSearchQuery(e.target.value)
            }
            serverSearchPlaceholder="Search companies..."
          />
          {/* <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Bulk Upload
            </button>
          </div> */}

          {/* Bulk Upload Modal */}
           {hasPermission(permissions, "import_company") && (
              <BulkAddModal
                onUploadComplete={handleBulkUpload}
                downloadFileUrl={"/sample_companies.xlsx"}
                uploadType={"company"}
              />
            )}

              {hasPermission(permissions, "add_company") && (
              <AddCompany onAdd={handleAdd} />
            )}

         
        </div>
        <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)]">
          <Header
            checkBox={true}
            className1="w-max xl:w-full grid sticky top-0 grid-cols-[40px_220px_170px_170px_160px_100px]  md:grid-cols-[50px_200px_165px_130px_140px_100px] xl:grid-cols-[40px_1.9fr_1fr_1fr_1fr_1fr] sm:gap-0"
            headersall={headersOptions}
            handleSelectAll={handleSelectAll}
            isAllSelected={
              allCards.length > 0 && selectedCards.length === allCards.length
            }
          />
          {loading && page === 1 ? (
            <Skeleton2
              colsNum={6}
              gridCols="grid-cols-[20px_200px_150px_150px_150px_250px] xl:grid-cols-[40px_1.9fr_1fr_1fr_1fr_1fr]"
            />
          ) : allCompanies.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No companies found.
            </div>
          ) : (
            allCompanies.map((company, index) => {
              const isLast = allCompanies.length === index + 1;
              return (
                <div ref={isLast ? lastCompanyRef : null} key={company.id}>
                  <CompanyCard
                    data={company}
                    isSelected={selectedCards.includes(company.id)}
                    onCardSelect={handleCardSelect}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onClick={() => handleCompanyClick(company.id)}
                  />
                </div>
              );
            })
          )}
          {loading && page > 1 && <Skeleton2 />}
          {!hasMore && !loading && allCompanies.length > 0 && (
            <p className="text-center text-gray-500 py-4">End of list</p>
          )}
        </div>
      </section>
    </>
  );
};

export default CompanyRoute;
