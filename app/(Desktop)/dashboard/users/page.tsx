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
import { UserListProps, UserProps } from "@/types/usertypes";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Operations from "@/components/Others/Operations";
import Skeleton2 from "@/components/Others/Skeleton2";
import Header from "@/components/Others/Header";
import AddUser from "@/components/Modals/AddModals/AddUser";
import UserCard from "@/components/Card/UserCard";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import Button from "@/components/Others/Button";
import { Plus } from "lucide-react";

const headersOptions = [
  { value: "Full Name" },
  { value: "Role" },
  { value: "Phone" },
  { value: "Email" },
  // { value: "Created At" },
  // { value: "Updated At" },
  { value: "Actions" },
];

const UserRoute = () => {
  // --- Core Hooks ---
  const { data: session } = useSession();
  console.log(session,"wduio")
  const searchParams = useSearchParams();
  const router = useRouter();


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

  const handleCreateUser = () => {
  router.push("/dashboard/users/create-user");
};

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
  if (!session || (page > 1 && !hasMore)) {
    return;
  }
  

    const fetchData = async () => {
      setLoading(true);
      console.log("Starting fetch for page:", page);
      
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "10");

        let url: string;
        if (debouncedSearchQuery) {
              const params = new URLSearchParams();
          params.append("query", debouncedSearchQuery);
          url = `/user/search?${params.toString()}`;
        } else {
          if (selectedRole && selectedRole !== "All") {
            params.append("role", selectedRole);
          }
          url = `/user`;
        }

        console.log("Fetching URL:", url);
        console.log("With params:", Object.fromEntries(params));

        const response = await apiClient.get<UserListProps>(url);
        console.log(response.data.users,"response")
        // console.log(response.data.users[Role],"response")

        console.log("API Response:", response.data);
        const newUsers = response.data.users.map((user: any) => ({
      ...user,
      role: user.Role?.code || "N/A", // convert Role.code → role
    }));
        console.log("New users count:", newUsers.length);

        if (page === 1) {
          setAllUsers(newUsers);
        } else {
          setAllUsers((prev) => [...prev, ...newUsers]);
        }

        // Handle pagination - note your API returns "tatalPages" (typo)
        const currentPage = response.data.page || page;
        const totalPages = response.data.totalPages || response.data.totalPages || 1;
        
        console.log("Pagination info:", { currentPage, totalPages, hasMore: currentPage < totalPages });
        setHasMore(currentPage < totalPages);
      } catch (error: any) {
      
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  if (!updatedData) return;

  setAllUsers((prev) => {
    const exists = prev.some((data) => data.id === updatedData.id);

    if (exists) {
      // Replace existing user
      return prev.map((data) => (data.id === updatedData.id ? updatedData : data));
    } else {
      // Append new user if not found
      return [updatedData, ...prev];
    }
  });
};


  
  
  const handleDeleteSelected = async () => {
    /* ... */
  };

  // --- Render Logic ---
  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Users" }]} />
      <section className="bg-white  sm:rounded-xl p-3 sm:p-5 h-[calc(100vh-105px)] flex flex-col">
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
          <Button
  onClick={handleCreateUser}
  className="bg-primary text-white px-4 py-2 rounded-lg md:rounded-full"
    icon={<Plus />}
>
  Create User
  
</Button>


        </div>
        <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)]">
          <Header
            checkBox={true}
            className1="w-full xl:w-full grid sticky top-0 grid-cols-[20px_250px_150px_150px_250px_150px] xl:grid-cols-[40px_1.5fr_1.2fr_1fr_2fr_1fr] border gap-5 sm:gap-0"
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

