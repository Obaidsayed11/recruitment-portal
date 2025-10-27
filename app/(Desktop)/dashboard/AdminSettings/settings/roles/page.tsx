

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

import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Operations from "@/components/Others/Operations";
import Skeleton2 from "@/components/Others/Skeleton2";
import Header from "@/components/Others/Header";
import AddUser from "@/components/Modals/AddModals/AddUser";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";
// import AddJobgroups from "@/components/Modals/AddModals/AddJobgroups";
import GroupCard from "@/components/Card/GroupsCard";
import { GroupListProps, GroupProps, RoleListProps, RoleProps } from "@/types/settingsinterface";
import AddGroup from "@/components/Modals/AddModals/AddGroups";
import RolesCard from "@/components/Card/RolesCard";
import AddRoles from "@/components/Modals/AddModals/AddRoles";

const headersOptions = [
  {value: "Role Name"},
  {value: "Role Code"},
  { value: "Description" },
  {value: "Role Type"},
  
  
  { value: "Action" },

  ];


const SettingRoles = () => {






  

  // --- Core Hooks ---
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // --- State Declarations ---
  const [roles, setRoles] = useState<RoleProps[]>([]);
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
  const allCards = useMemo(() => roles.map((data) => data.id), [roles]);

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
    setRoles([]);
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
          params.append("query", debouncedSearchQuery);
          response = await apiClient.get<RoleListProps>(
            `/roles/search?${params.toString()}`
          );
        } else {
          // --- Paginated Role Filter Logic ---
          if (selectedRole && selectedRole !== "All") {
            
            params.append("role", selectedRole);
          }
          response = await apiClient.get<RoleListProps>(
            `/roles/search?${params.toString()}`
          );
        }
        console.log(response);
        const newRoles = response.data.roles || [];

        // If it's the first page, we are starting a new list.
        // For all subsequent pages, we append to the existing list.
        if (page === 1) {
          setRoles(newRoles);
        } else {
          setRoles((prev) => [...prev, ...newRoles]);
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
  const handleDelete = (id: string) =>
    setRoles((prev) => prev.filter((data) => data.id !== id));
  const handleAddRoles = (newRoles: RoleProps) => {
    if (newRoles) setRoles((prev) => [newRoles, ...prev]);
  };
  const handleUpdate = (updatedData: RoleProps) => {
    if (updatedData)
      setRoles((prev) =>
        prev.map((data) => (data.id === updatedData.id ? updatedData : data))
      );
  };
  const handleDeleteSelected = async () => {
    /* ... */
  };
 return (
  <>
    {/* <DynamicBreadcrumb links={[{ label: "Groups" }]} /> */}

     <section
        className="bg-white sm:rounded-xl 
        p-3 sm:p-5 flex flex-col max-h-[calc(100vh-180px)] w-full"
      >
      {/* Top Operations Bar */}
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
          serverSearchPlaceholder="Search all Roles..."
        />

        {/* <div className="w-full sm:w-auto"> */}
          <AddRoles onAdd={handleAddRoles} />
        {/* </div> */}
      </div>

      {/* Scrollable User List */}
         <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)]">
        {/* Header */}
        <Header
          checkBox={true}
         className1="w-full xl:w-full grid sticky top-0 grid-cols-[20px_200px_150px_150px_150px_250px] xl:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] border gap-5 sm:gap-0 text-left"
          headersall={headersOptions}
          handleSelectAll={handleSelectAll}
          isAllSelected={
            allCards.length > 0 && selectedCards.length === allCards.length
          }
        />

        {/* User List */}
      
          {loading && page === 1 ? (
            <Skeleton2 />
          ) : roles.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No Groups found.
            </div>
          ) : (
           roles.map((role, index) => {
  const isLastElement = roles.length === index + 1;
  const ref = isLastElement && searchQuery === "" ? lastUserElementRef : null;

  return (
    <div ref={ref} key={role.id}>
      <RolesCard
        data={role}
        isSelected={selectedCards.includes(role.id)}
        onCardSelect={handleCardSelect}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
})

          )}

          {loading && page > 1 && <Skeleton2 />}

          {!hasMore && !loading && roles.length > 0 && (
            <p className="text-center text-gray-500 py-4">
              You have reached the end of the list.
            </p>
          )}
        </div>
   
    </section>
  </>
);

}

export default SettingRoles