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
import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "@/components/PermissionContext";
import BulkAddModal from "@/components/Others/BulkAddModal";

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
  console.log(session, "wduio");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { permissions } = usePermissions();

  // --- State Declarations ---
  const [allUsers, setAllUsers] = useState<UserProps[]>([]);

  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
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
    router.push("/users/create-user");
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
  // useEffect(() => {
  //   const PAGE_SIZE = 20;

  //   // Guard clause to prevent fetching if not ready.
  //   if (!session) {
  //     return;
  //   }

  //   const fetchData = async () => {
  //     if (page > 1 && !hasMore) {
  //       return;
  //     }
  //     setLoading(true);

  //     try {
  //       const params = new URLSearchParams();
  //       params.append("page", page.toString());
  //       params.append("limit", PAGE_SIZE.toString());

  //     let response;
  //       if (debouncedSearchQuery) {
  //         const params = new URLSearchParams();
  //         params.append("query", debouncedSearchQuery);
  //         response = `/user/search?${params.toString()}`;
  //       } else {
  //         if (selectedRole && selectedRole !== "All") {
  //           params.append("role", selectedRole);

  //         }
  //            response = await apiClient.get<UserListProps>(
  //           `/user?${params.toString()}`)
  //           console.log(response,"csdfasd")
  //       }
  //       const newUsers = response.data.users.map((user: any) => ({
  //         ...user,
  //         role: user.Role?.code || "N/A", // convert Role.code → role
  //       }));
  //       console.log("New users count:", newUsers.length);

  //       if (page === 1) {
  //         setAllUsers(newUsers);
  //       } else {
  //         setAllUsers((prev) => [...prev, ...newUsers]);
  //       }

  //       // Handle pagination - note your API returns "tatalPages" (typo)
  //       const currentPage = response.data.page || page;
  //       const totalPages =
  //         response.data.totalPages || response.data.totalPages || 1;

  //       console.log("Pagination info:", {
  //         currentPage,
  //         totalPages,
  //         hasMore: currentPage < totalPages,
  //       });
  //       setHasMore(currentPage < totalPages);
  //     } catch (error: any) {
  //       console.error("Error fetching users:", error);
  //       toast.error("Failed to fetch users");
  //       setHasMore(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [page, debouncedSearchQuery, selectedRole, session]);

  useEffect(() => {
    const PAGE_SIZE = 10;

    // Guard clause to prevent fetching if not ready.
    if (!session) {
      return;
    }

    const fetchData = async () => {
      if (page > 1 && !hasMore) {
        return;
      }
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", PAGE_SIZE.toString());
        let response;

        if (debouncedSearchQuery) {
          // Search query case

          params.append("query", debouncedSearchQuery);
          // searchParams.append("page", page.toString());
          // searchParams.append("limit", PAGE_SIZE.toString());

          response = await apiClient.get<UserListProps>(
            `/user/search?${params.toString()}`
          );
        } else {
          // Regular list case

          if (selectedRole && selectedRole !== "All") {
            params.append("role", selectedRole);
          }

          response = await apiClient.get<UserListProps>(
            `/user?${params.toString()}`
          );
        }

        console.log(response, "response data");

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

        // Handle pagination
        const currentPage = response.data.page
          ? parseInt(response.data.page)
          : page;
        const totalPages = response.data.totalPages
          ? parseInt(response.data.totalPages)
          : 1;

        console.log("Pagination info:", {
          currentPage,
          totalPages,
          hasMore: currentPage < totalPages,
        });

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
        return prev.map((data) =>
          data.id === updatedData.id ? updatedData : data
        );
      } else {
        // Append new user if not found
        return [updatedData, ...prev];
      }
    });
  };

  // allUsers.map((user, index) => {
  //   console.log(user.Role?.name, "dqyfdddddddddddddddddddddddddddddd");
  //   const rolees = user.role;
  //   return rolees;
  // });

  const handleDeleteSelected = async () => {
    if (selectedCards.length > 0) {
      try {
        const response = await apiClient.delete("/user/bulk", {
          data: { ids: selectedCards },
        });
        toast.success(response.data.message);
        setAllUsers((prevData) =>
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
  useEffect(() => {
    if (!session) return;
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get(`/user/filter`);
        console.log(res, "res of des");

        setRoles(res.data.data || []);

        // Optionally pre-select department from `data.department`:
      } catch (error) {
        toast.error("Failed to fetch departments");
      }
    };

    fetchRoles();
  }, [session]);

  const uniqueRoles = roles.map((role) => ({
    
    label:`${role.name}`,
    value: role.name
  }));
  console.log(uniqueRoles, "uniqyueee");



    useEffect(() => {
    if (permissions && !hasPermission(permissions, "list_users")) {
      router.push("/users");
    }
  }, [permissions, router])


  // bulk data
  const handleBulkUpload = (newBulkData: any[]) => {
      if (newBulkData && newBulkData.length > 0) {
        setAllUsers((prevData) => [...newBulkData, ...prevData]);
        toast.success(`${newBulkData.length} new Users added successfully!`);
      } else {
        toast.error("Bulk upload failed or returned no new data.");
      }
    };

  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Users" }]} />
      <section className="bg-white  sm:rounded-xl p-3 sm:p-5 max-h-[calc(100vh-105px)]  flex flex-col">
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
                  options: uniqueRoles,
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


          {/* Bulk Upload Modal */}
           {hasPermission(permissions, "import_user") && (
              <BulkAddModal
                onUploadComplete={handleBulkUpload}
                downloadFileUrl={"/sample_users.xlsx"}
                uploadType={"user"}
              />
            )}

         { hasPermission(permissions, "add_user") && (<Button
            onClick={handleCreateUser}
            className="bg-primary text-white px-4 py-2 rounded-lg md:rounded-full"
            icon={<Plus />}
          >
            Create User
          </Button>)}
        </div>
        <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)] md:w-max">
          <Header
            checkBox={true}
            className1="w-max xl:w-full grid sticky top-0 grid-cols-[20px_250px_150px_150px_250px_100px]  md:grid-cols-[50px_200px_150px_150px_200px_120px] xl:grid-cols-[40px_1.5fr_1.2fr_1fr_2fr_1fr] border gap-5 sm:gap-0"
            headersall={headersOptions}
            handleSelectAll={handleSelectAll}
            isAllSelected={
              allCards.length > 0 && selectedCards.length === allCards.length
            }
          />

          {loading && page === 1 ? (
            <Skeleton2 
            colsNum={6}
            gridCols="grid-cols-[20px_250px_150px_150px_250px_150px] xl:grid-cols-[40px_1.5fr_1.2fr_1fr_2fr_1fr]"
            />
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
