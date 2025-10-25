"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

const headersOptions = [
  { value: "Logo" },
  { value: "Name" },
  { value: "Website" },
  { value: "Career Page" },
  { value: "Description" },
  { value: "Actions" },
];

const CompanyRoute = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [allCompanies, setAllCompanies] = useState<CompanyProps[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [serverSearchQuery, setServerSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(serverSearchQuery, 500);

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
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (!session || (page > 1 && !hasMore)) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "10");
        if (debouncedSearchQuery){ 
          
              const params = new URLSearchParams();
          params.append("query", debouncedSearchQuery);}

        const url = debouncedSearchQuery ? `/company/search?${params}` : `/company?${params}`;
        const response = await apiClient.get<CompanyListProps>(url);
        const newCompanies = response.data.companies;

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
    if (!updatedData) return;
    setAllCompanies((prev) =>
      prev.some((c) => c.id === updatedData.id)
        ? prev.map((c) => (c.id === updatedData.id ? updatedData : c))
        : [updatedData, ...prev]
    );
  };

  // NEW: Handle company click to navigate to detail page
  const handleCompanyClick = (companyId: string) => {
    router.push(`/dashboard/AdminCompanies/${companyId}`);
  };

  return (
    <>
      <DynamicBreadcrumb links={[{ label: "Companies" }]} />
      <section className="bg-white sm:rounded-xl p-3 sm:p-5 h-[calc(100vh-105px)] flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-5">
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
            isAllSelected={allCards.length > 0 && selectedCards.length === allCards.length}
            selectedCount={selectedCards.length}
            handleSelectAll={handleSelectAll}
            onDeleteSelected={() => {}}
            searchQuery={searchQuery}
            handleSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            serverSearchQuery={serverSearchQuery}
            handleServerSearchQueryChange={(e) => setServerSearchQuery(e.target.value)}
            serverSearchPlaceholder="Search companies..."
          />
          <AddCompany onAdd={handleAdd} />
        </div>
        <div className="overflow-auto h-[calc(100vh-210px)]">
          <Header
            checkBox={true}
            className1="w-full xl:w-full grid sticky top-0 grid-cols-[20px_250px_150px_150px_150px_250px_150px_150px_100px] xl:grid-cols-[40px_1.5fr_1fr_1fr_1fr_2fr_1fr]"
            headersall={headersOptions}
            handleSelectAll={handleSelectAll}
            isAllSelected={allCards.length > 0 && selectedCards.length === allCards.length}
          />
          {loading && page === 1 ? (
            <Skeleton2 />
          ) : allCompanies.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No companies found.</div>
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