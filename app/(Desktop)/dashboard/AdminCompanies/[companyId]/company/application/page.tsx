"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import apiClient from "@/lib/axiosInterceptor";
// import { UserListProps, UserProps } from "@/types/interface";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Operations from "@/components/Others/Operations";
import Skeleton2 from "@/components/Others/Skeleton2";
import Header from "@/components/Others/Header";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";
import AddApplication from "@/components/Modals/AddModals/AddApplication";
import { ApplicationListProps, ApplicationProps } from "@/types/companyInterface";
import ApplicationCard from "@/components/Card/ApplicationCard";

const headersOptions = [
  { value: "Candidate Name" },
  { value: "Email" },
  { value: "Phone" },
  { value: "Resume" },          
  { value: "Experience" },  
  { value: "Skills" },      
  { value: "Current CTC" },     
  { value: "Expected CTC" },    
  { value: "Notice Period" },   
  { value: "Status" },         
  { value: "Source" },          
  // { value: "Created At" },     
  // { value: "Updated At" },      
  // { value: "Notes" },           
  { value: "Actions" }          
  // REMOVED: "History" - not in API response
];

type Props = {
  companyId: string;
};

const CompanyApplication: React.FC<Props> = ({ companyId }) => {

  

  // --- Core Hooks ---
  const { data: session } = useSession();
  console.log(session,"swessio")
  const searchParams = useSearchParams();

  // --- State Declarations ---
  // const [applications, setApplications] = useState<UserProps[]>([]);
  const [applications, setApplications] = useState<ApplicationProps[]>([]);
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
  const allCards = useMemo(() => applications.map((data) => data.id), [applications]);

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
    setApplications([]);
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
      setLoading(true);
      try {
        // Build parameters dynamically for every request
        const params = new URLSearchParams();
        params.append("page", page.toString());
      params.append("limit","10")

        let response;
        if (debouncedSearchQuery) {
          // --- Paginated Server Search Logic ---
          params.append("query", debouncedSearchQuery);
          response = await apiClient.get<ApplicationListProps>(
            `/admin/users/search?${params.toString()}`
          );
        } else {
          // --- Paginated Role Filter Logic ---
          // if (selectedRole && selectedRole !== "All") {
          //   params.append("role", selectedRole);
          // }
           response = await apiClient.get<ApplicationListProps>(
          `/application?companyId=${companyId}&${params.toString()}`
          );
        }
        console.log(response);
        const newApplications = response.data.applications || [];

        // If it's the first page, we are starting a new list.
        // For all subsequent pages, we append to the existing list.
        if (page === 1) {
          setApplications(newApplications);
        } else {
          setApplications((prev) => [...prev, ...newApplications]);
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
  }, [page, debouncedSearchQuery, selectedRole, session, companyId]);
  // --- Event Handlers ---
  const handleSelectAll = (isChecked: boolean) =>
    setSelectedCards(isChecked ? allCards : []);
  const handleCardSelect = (cardId: string, isChecked: boolean) =>
    setSelectedCards((prev) =>
      isChecked ? [...prev, cardId] : prev.filter((id) => id !== cardId)
    );
  const handleDelete = (id: string) =>
    setApplications((prev) => prev.filter((data) => data.id !== id));
 const handleAddApplication = (newApplication: ApplicationProps) => {
  if (newApplication) setApplications(prev => [newApplication, ...prev]);
};
  const handleUpdate = (updatedData: ApplicationProps) => {
    if (updatedData)
      setApplications((prev) =>
        prev.map((data) => (data.id === updatedData.id ? updatedData : data))
      );
  };
  const handleDeleteSelected = async () => {
    /* ... */
  };
  return (
  <>
    {/* <DynamicBreadcrumb links={[{ label: "Applications" }]} /> */}

     <section
       className="bg-white sm:rounded-xl 
      p-3 sm:p-5 flex flex-col w-[82.5vw] h-[calc(100vh-169px)]"
    >
      {/* --- Header Section --- */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center 
        justify-between gap-3 sm:gap-4 pb-5"
      >
        <Operations
          filterProps={{
            filter: true,
            filters: [
              {
                queryKey: "role",
                options: ["DRIVER", "OUTLET", "WAREHOUSE", "DISPATCHER"],
              },
            ],
          }}
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
          serverSearchPlaceholder="Search all Application..."
        />

        {/* <div className="w-full sm:w-auto"> */}
          <AddApplication onAdd={handleAddApplication} />
        {/* </div> */}
      </div>

      {/* --- Scrollable Table Section --- */}
      <div
         className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw)] sm:w-[calc(100vw-82px)]">
        {/* Header */}
        {/* --- Table Header --- */}
        <Header
          checkBox={true}
         className1="w-full xl:w-full grid sticky top-0 grid-cols-[30px_180px_220px_150px_120px_250px_200px_200px_200px_200px_200px_200px_200px] border gap-5 sm:gap-0 "
          headersall={headersOptions}
          handleSelectAll={handleSelectAll}
          isAllSelected={
            allCards.length > 0 && selectedCards.length === allCards.length
          }
        />

        {/* --- Table Body --- */}
        <div className="divide-y divide-gray-100 ">
          {loading && page === 1 ? (
            <Skeleton2 />
          ) : applications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No Applications found.
            </div>
          ) : (
            applications.map((application, index) => {
              const isLastElement = applications.length === index + 1;
              const ref =
                isLastElement && searchQuery === "" ? lastUserElementRef : null;

              return (
                <div ref={ref} key={application.id}>
                  <ApplicationCard
                    data={application}
                    isSelected={selectedCards.includes(application.id)}
                    onCardSelect={handleCardSelect}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </div>
              );
            })
          )}

          {loading && page > 1 && <Skeleton2 />}

          {!hasMore && !loading && applications.length > 0 && (
            <p className="text-center text-gray-500 py-4">
              You have reached the end of the list.
            </p>
          )}
        </div>
      </div>
    </section>
  </>
);

}

export default CompanyApplication