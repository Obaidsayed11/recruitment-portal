"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import apiClient from "@/lib/axiosInterceptor";
// import { UserListProps, UserProps } from "@/types/interface";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Operations from "@/components/Others/Operations";
import Skeleton2 from "@/components/Others/Skeleton2";
import Header from "@/components/Others/Header";
import AddUser from "@/components/Modals/AddModals/AddUser";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";

import AddDepartment from "@/components/Modals/AddModals/AddDepartment";
import DepartmentCard from "@/components/Card/DepartmentCard";
import { DepartmentListProps, DepartmentProps } from "@/types/companyInterface";
import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "@/components/PermissionContext";
import BulkAddModal from "../Others/BulkAddModal";


const headersOptions = [
  { value: "Name" },
  { value: "Description" },
  {value: "Actions"}
  
];
type Props = {
  companyId: string;
   onRefreshAnalytics?: () => void;
};
const DepartmentsTab: React.FC<Props> = ({ companyId ,onRefreshAnalytics }) => {
  // --- Core Hooks ---
  const { data: session } = useSession();
  const searchParams = useSearchParams();
    const router = useRouter();
    const { permissions } = usePermissions();

  // --- State Declarations ---
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState(""); // For client-side filtering
  const [serverSearchQuery, setServerSearchQuery] = useState(""); // For server-side search
  const debouncedSearchQuery = useDebounce(serverSearchQuery, 500);
  const selectedRole = searchParams?.get("role") || "";

  // --- Memoized Values ---
  const allCards = useMemo(
    () => departments.map((data) => data.id),
    [departments]
  );

  // --- Refs and Callbacks for Infinite Scroll ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // --- Effects ---

  // --- 1. Effect to RESET state on a new query (search or filter change) ---
  // This runs ONLY when the filter or debounced search term changes.
  useEffect(() => {
    setDepartments([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearchQuery, selectedRole]);

  // --- 2. Main effect for ALL data fetching ---
  // This single, robust hook handles fetching for new queries and pagination.
  useEffect(() => {
    // Stop if the session isn't ready or if we're on a later page and know there's no more data.
    if (!session || (page > 1 && !hasMore)) {
      return;
    }

    const fetchData = async () => {
      const PAGE_SIZE = 20;
      setLoading(true);
      try {
        // Build parameters dynamically for every request
        const params = new URLSearchParams();
        params.append("page", page.toString());
         params.append("limit", PAGE_SIZE.toString());

        let response;
        if (debouncedSearchQuery) {
          // --- Paginated Server Search Logic ---
              const params = new URLSearchParams();
          params.append("query", debouncedSearchQuery);
          response = await apiClient.get<DepartmentListProps>(
            `department/search?id=${companyId}&${params.toString()}`
          );
        } else {
          // --- Paginated Role Filter Logic ---
          if (selectedRole && selectedRole !== "All") {
            params.append("role", selectedRole);
          }
          response = await apiClient.get<DepartmentListProps>(
          `/department?companyId=${companyId}&${params.toString()}`
          );
        }
        console.log(response);
      
        const newDepartment = response.data.departments || [];

        // If it's the first page, we are starting a new list.
        // For all subsequent pages, we append to the existing list.
        if (page === 1) {
          setDepartments(newDepartment);
        } else {
          setDepartments((prev) => [...prev, ...newDepartment]);
        }

        // Update pagination status based on the API response.
        setHasMore(response.data.currentPage < response.data.totalPages);
      } catch (error: any) {
        // The catch block will now correctly handle 404 errors from requesting a page that doesn't exist.
        setHasMore(false); // Stop trying to fetch more if an error occurs.
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // This dependency array is now correct. It runs when the page or query changes, but will not loop on its own state updates.
  }, [page, debouncedSearchQuery, selectedRole, session]);
  // --- Event Handlers ---
  const handleSelectAll = (isChecked: boolean) =>
    setSelectedCards(isChecked ? allCards : []);
  const handleCardSelect = (cardId: string, isChecked: boolean) =>
    setSelectedCards((prev) =>
      isChecked ? [...prev, cardId] : prev.filter((id) => id !== cardId)
    );
 const handleDelete = (id: string) => {
  setDepartments((prev) => prev.filter((data) => data.id !== id));
  onRefreshAnalytics?.(); // ✅ Trigger analytics refresh
};

const handleAddDepartments = (newData: DepartmentProps) => {
  if (newData) {
    setDepartments((prev) => [newData, ...prev]);
    onRefreshAnalytics?.(); // ✅ Trigger analytics refresh
  }
};

  const handleUpdate = (updatedData: DepartmentProps) => {
    if (updatedData)
       
      setDepartments((prev) =>
        prev.map((data) => (data.id === updatedData.id ? updatedData : data))
      );
  };
    const handleDeleteSelected = async () => {
    if (selectedCards.length > 0) {
      try {
        const response = await apiClient.delete("/department/bulk", {
          data: { ids: selectedCards },
        });
        toast.success(response.data.message);
        setDepartments((prevData) =>
          prevData.filter((data) => !selectedCards.includes(data.id))
        );
        setSelectedCards([]);
         onRefreshAnalytics?.(); // ✅ Trigger refresh after bulk delete
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete selected locations"
        );
        console.error("Delete error:", error);
      }
    }
  };
 useEffect(() => {
    if (permissions && !hasPermission(permissions, "list_department")) {
      router.push(`/companies/${companyId}?tab=department`);
      
      
    }
  }, [permissions, router])


  // bulk data 
  
    //   const handleBulkUpload = (newBulkData: any[]) => {
    //   if (newBulkData && newBulkData.length > 0 ) {
    //     setDepartments((prevData) => [...newBulkData, ...prevData]);
    //     toast.success(`${newBulkData.length} new Departments added successfully!`);
    //   } else {
    //     toast.error("Bulk upload failed or returned no new data.");
    //   }
    // };

    const handleBulkUpload = (response: any) => {
  // Backend response shape example:
  // { message, createdCount, skippedCount, skippedDepartments }

  if (!response) {
    toast.error("Bulk upload failed. Please try again.");
    return;
  }

  const { createdCount = 0, skippedCount = 0, message } = response;

  if (createdCount > 0) {
    toast.success(`${createdCount} new departments added successfully!`);
  }

  if (skippedCount > 0) {
    toast.warning(
      `${skippedCount} departments were skipped (possibly duplicates).`
    );
  }

  if (createdCount === 0 && skippedCount === 0) {
    toast.error("No departments were added or skipped — something went wrong.");
  }

  // Update the list only if new departments were created
  if (response.newDepartments && response.newDepartments.length > 0) {
    setDepartments((prevData) => [...response.newDepartments, ...prevData]);
     onRefreshAnalytics?.(); // ✅ Trigger refresh after bulk upload
  }
};

  

  return (
    <>
      {/* <DynamicBreadcrumb links={[{ label: "Departments" }]} /> */}
      <section
        className="bg-white sm:rounded-xl 
        p-3 sm:p-5 flex flex-col max-h-[calc(100vh-308px)] w-full"
      >
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center 
        xl:justify-between gap-3 sm:gap-4 pb-5 sm:flex-wrap lg:flex-nowrap" 
        >
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
            serverSearchPlaceholder="Search all Departments..."
          />


          {/* Bulk Upload Modal */}
           {hasPermission(permissions, "import_department") && (
              <BulkAddModal
                onUploadComplete={handleBulkUpload}
                downloadFileUrl={"/sample_departments.xlsx"}
                uploadType={"department"}
              />
            )}

          
            { hasPermission(permissions, "add_department") && (<AddDepartment onAdd={handleAddDepartments}/>)}
        </div>
        <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)]">
          {/* Header */}
          <Header
            checkBox={true}
           className1="w-full xl:w-full grid sticky top-0 grid-cols-[20px_200px_150px_150px] md:grid-cols-[40px_200px_300px_150px] xl:grid-cols-[48px_0.6fr_1.2fr_0.4fr] border gap-5 sm:gap-0 text-left"
   
            headersall={headersOptions} 
            handleSelectAll={handleSelectAll}
            isAllSelected={
              allCards.length > 0 && selectedCards.length === allCards.length
            }
          />

          {loading && page === 1 ? (
            <Skeleton2 
            colsNum={4}
            gridCols="grid-cols-[20px_200px_150px_150px] xl:grid-cols-[40px_1fr_1fr_1fr] "
            />
          ) : departments.length === 0 ? (
            <div className="text-center py-10 text-gray-500" >
              No Departments found.
            </div>
          ) : (
            departments.map((data, index) => {
              const isLastElement = departments.length === index + 1;
              // Attach observer only when not using the client-side filter
              const ref =
                isLastElement && searchQuery === "" ? lastUserElementRef : null;
              return (
                <div ref={ref} key={data.id}>
                  <DepartmentCard
                    data={data}
                    isSelected={selectedCards.includes(data.id)}
                    onCardSelect={handleCardSelect}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </div>
              );
            })
          )}
          {loading && page > 1 && <Skeleton2 />}
          {!hasMore && !loading && departments.length > 0 && (
            <p className="text-center text-gray-500 py-4">
              You have reached the end of the list.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default DepartmentsTab;
