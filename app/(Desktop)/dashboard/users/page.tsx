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
import { UserListProps, UserProps } from "@/types/interface";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Operations from "@/components/Others/Operations";
import Skeleton2 from "@/components/Others/Skeleton2";
import Header from "@/components/Others/Header";
import AddUser from "@/components/Modals/AddModals/AddUser";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";

const headersOptions = [
  { value: "Full Name" },
  { value: "Role" },
  { value: "Phone" },
  { value: "Email" },
  { value: "Created At" },
  { value: "Updated At" },
  { value: "Actions" },
];

const UserRoute = () => {
  // --- Core Hooks ---
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // --- State Declarations ---
  const [allUsers, setAllUsers] = useState<UserProps[]>([]);
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
  const allCards = useMemo(() => allUsers.map((data) => data.id), [allUsers]);

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
    setAllUsers([]);
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

        let response;
        if (debouncedSearchQuery) {
          // --- Paginated Server Search Logic ---
          params.append("query", debouncedSearchQuery);
          response = await apiClient.get<UserListProps>(
            `/admin/users/search?${params.toString()}`
          );
        } else {
          // --- Paginated Role Filter Logic ---
          if (selectedRole && selectedRole !== "All") {
            params.append("role", selectedRole);
          }
          response = await apiClient.get<UserListProps>(
            `/admin/users?${params.toString()}`
          );
        }
        console.log(response);
        const newUsers = response.data.users || [];

        // If it's the first page, we are starting a new list.
        // For all subsequent pages, we append to the existing list.
        if (page === 1) {
          setAllUsers(newUsers);
        } else {
          setAllUsers((prev) => [...prev, ...newUsers]);
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
    setAllUsers((prev) => prev.filter((data) => data.id !== id));
  const handleAdd = (newData: UserProps) => {
    if (newData) setAllUsers((prev) => [newData, ...prev]);
  };
  const handleUpdate = (updatedData: UserProps) => {
    if (updatedData)
      setAllUsers((prev) =>
        prev.map((data) => (data.id === updatedData.id ? updatedData : data))
      );
  };
  const handleDeleteSelected = async () => {
    /* ... */
  };

  // --- Render Logic ---
  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Users" }]} />
      <section className="bg-white border border-[#E8E8E8] sm:rounded-xl p-3 sm:p-5 h-[calc(100vh-105px)] flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center 
        justify-between gap-3 sm:gap-4 pb-5">
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
            serverSearchPlaceholder="Search all users..."
          />
          <AddUser onAdd={handleAdd} />
        </div>
        <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)]">
          <Header
            checkBox={true}
            className1="w-full xl:w-full grid sticky top-0 grid-cols-[20px_250px_150px_150px_250px_150px_150px_100px] xl:grid-cols-[20px_1.5fr_1fr_1fr_2fr_1fr_1fr_1fr] border gap-5"
            headersall={headersOptions}
            handleSelectAll={handleSelectAll}
            isAllSelected={
              allCards.length > 0 && selectedCards.length === allCards.length
            }
          />

          {loading && page === 1 ? (
            <Skeleton2 />
          ) : allUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No users found.
            </div>
          ) : (
            allUsers.map((user, index) => {
              const isLastElement = allUsers.length === index + 1;
              // Attach observer only when not using the client-side filter
              const ref =
                isLastElement && searchQuery === "" ? lastUserElementRef : null;
              return (
                <div ref={ref} key={user.id}>
                  <UserCard
                    data={user}
                    isSelected={selectedCards.includes(user.id)}
                    onCardSelect={handleCardSelect}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </div>
              );
            })
          )}
          {loading && page > 1 && <Skeleton2 />}
          {!hasMore && !loading && allUsers.length > 0 && (
            <p className="text-center text-gray-500 py-4">
              You have reached the end of the list.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default UserRoute;

