  "use client";
  import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
  } from "react";
  import { useSession } from "next-auth/react";
  import { useParams, useSearchParams } from "next/navigation";
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
  import AddJobDescription from "@/components/Modals/AddModals/AddJobDescription";
  import { AddJobModalProps, JobDescriptionProps, UpdateJobDescriptionProps ,JobDescriptionListProps} from "@/types/companyInterface";
  import JobDescriptionCard from "@/components/Card/JobDescriptionCard";

  const headersOptions = [
    { value: "Job Title" },
    { value: "Experience/Salary" },
    { value: "Department" },
    { value: "Employment Type" },
    { value: "Published" },
    { value: "Status" },
    {value: "Actions"}
    ];

    type Props = {
    companyId?: string | null;
  };

  const JobDescription: React.FC<Props> = ({ companyId }) => {






    

    // --- Core Hooks ---
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    console.log(session,"sesdsion")

  // const companyId = session?.user?.companyId || null
  //  const { companyId } = useParams();
  // console.log(companyId,"ehiehi")

    // --- State Declarations ---
    const [description, setDescription] = useState<JobDescriptionProps[]>([]);
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
    const allCards = useMemo(() => description.map((data) => data.id), [description]);

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
      setDescription([]);
      setPage(1);
      setHasMore(true);
    }, [debouncedSearchQuery,companyId, page,]);

    // --- 2. Main effect for ALL data fetching ---
    // This single, robust hook handles fetching for new queries and pagination.
    useEffect(() => {
      
      // Stop if the session isn't ready or if we're on a later page and know there's no more data.
      if (!session || (page > 1 && !hasMore)) {
        return;
      }
      if (!companyId) return;
      

    const fetchData = async () => {
  setLoading(true);
  try {
      const params = new URLSearchParams();
        params.append("page", page.toString());
      params.append("limit","10")
    let response;

    if (debouncedSearchQuery) {
      // --- Search Logic ---
      const params = new URLSearchParams();
      params.append("query", debouncedSearchQuery);

      response = await apiClient.get<JobDescriptionListProps>(
        `/job/search?id=${companyId}&${params.toString()}`
      );
    } else {
      // --- Normal Pagination Logic ---
  

      if (selectedRole && selectedRole !== "All") {
        params.append("role", selectedRole);
      }

      response = await apiClient.get<JobDescriptionListProps>(
        `/job?companyId=${companyId}&${params.toString()}`
      );
    }

    const newDescription = response.data.jobs || [];

    if (page === 1) {
      setDescription(newDescription as any);
    } else {
      setDescription((prev) => [...prev, ...newDescription]);
    }

    setHasMore(response.data.currentPage < response.data.totalPages);
  } catch (error: any) {
    setHasMore(false);
  } finally {
    setLoading(false);
  }
};


      fetchData();
      // This dependency array is now correct. It runs when the page or query changes, but will not loop on its own state updates.
    }, [session, companyId, page, debouncedSearchQuery]);
    // --- Event Handlers ---
    const handleSelectAll = (isChecked: boolean) =>
      setSelectedCards(isChecked ? allCards : []);
    const handleCardSelect = (cardId: string, isChecked: boolean) =>
      setSelectedCards((prev) =>
        isChecked ? [...prev, cardId] : prev.filter((id) => id !== cardId)
      );
    const handleDelete = (id: string) =>
      setDescription((prev) => prev.filter((data) => data.id !== id));
    const handleAddDescription = (newData: JobDescriptionProps) => {
      if (newData) setDescription((prev) => [newData, ...prev]);
    };
    const handleUpdate = (updatedData: JobDescriptionProps) => {
      if (updatedData)
        setDescription((prev) =>
          prev.map((data) => (data.id === updatedData.id ? updatedData : data))
        );
    };
    console.log(description,"desccccccccccc")
    const handleDeleteSelected = async () => {
      /* ... */
    };
  return (
    <>
      {/* <DynamicBreadcrumb links={[{ label: "Job Description" }]} /> */}

      <section
        className="bg-white sm:rounded-xl 
        p-3 sm:p-5 flex flex-col max-h-[calc(100vh-308px)] w-full"
      >
        {/* Top Operations Bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center 
          justify-between gap-3 sm:gap-4 pb-5 "
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
            serverSearchPlaceholder="Search all Job Description..."
          />

          {/* <div className="w-full sm:w-auto"> */}
            <AddJobDescription onAdd={handleAddDescription} />
          {/* </div> */}
        </div>

        {/* Scrollable User List */}
       <div className="overflow-auto h-[calc(100vh-210px)] 2xl:w-full w-[calc(100vw-30px)] sm:w-[calc(100vw-82px)]">
          {/* Header */}
          <Header
    checkBox={true}
      className1="w-full xl:w-full grid sticky top-0 grid-cols-[20px_200px_150px_150px_150px_250px_150px_150px] xl:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border gap-5 sm:gap-0 text-left"
   
    headersall={headersOptions}
    handleSelectAll={handleSelectAll}
    isAllSelected={
      allCards.length > 0 && selectedCards.length === allCards.length
    }
  />


          {/* User List */}
         
            {loading && page === 1 ? (
              <Skeleton2 />
            ) : description.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No Descriptions found.
              </div>
            ) : (
              description.map((desc, index) => {
                const isLastElement = description.length === index + 1;
                const ref =
                  isLastElement && searchQuery === "" ? lastUserElementRef : null;
                  

                return (
                  <div ref={ref} key={desc.id}>
                    <JobDescriptionCard
                      data={desc}
                      isSelected={selectedCards.includes(desc?.id)}
                      onCardSelect={handleCardSelect}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  </div>
                );
              })
            )}

            {loading && page > 1 && <Skeleton2 />}

            {!hasMore && !loading && description.length > 0 && (
              <p className="text-center text-gray-500 py-4">
                You have reached the end of the list.
              </p>
            )}
          </div>
      
      </section>
    </>
  );

  }

  export default JobDescription