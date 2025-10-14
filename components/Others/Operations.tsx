import React from "react";
import { Filter, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SearchField from "./SearchFiled";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { string } from "zod";

interface OperationsProps {
  filterProps?: {
    filter: boolean;
    filters: {
      queryKey: string;
      options: string[];
    }[];
  };
  checkBox?: boolean;
  isAllSelected?: boolean;
  selectedCount?: number;
  handleSelectAll?: (isChecked: boolean) => void;
  onDeleteSelected?: () => void;
  searchQuery?: string;
  handleSearchQueryChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  serverSearchQuery?: string;
  handleServerSearchQueryChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  serverSearchPlaceholder?: string;
}

const Operations: React.FC<OperationsProps> = ({
  filterProps,
  checkBox,
  isAllSelected = false,
  selectedCount = 0,
  handleSelectAll,
  onDeleteSelected,
  searchQuery,
  handleSearchQueryChange,
  serverSearchQuery,
  handleServerSearchQueryChange,
  serverSearchPlaceholder = "Search all products...",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRoleFilterChange = (queryKey: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(queryKey, value);
    } else {
      params.delete(queryKey);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="gap-2 w-full md:w-[70%] flex md:gap-3 items-center">
      <div className="flex gap-2 items-center">
        {handleServerSearchQueryChange ? (
          <SearchField
            placeholder={serverSearchPlaceholder}
            searchQuery={serverSearchQuery}
            handleSearchQueryChange={handleServerSearchQueryChange}
          />
        ) : (
          <SearchField
            placeholder="Search"
            searchQuery={searchQuery}
            handleSearchQueryChange={handleSearchQueryChange}
          />
        )}
        {filterProps?.filter &&
          filterProps.filters.map((filter) => {
            const selectedValue = searchParams?.get(filter.queryKey) ?? "";

            return (
              <Select
                key={filter.queryKey}
                value={selectedValue}
                onValueChange={(value) =>
                  handleRoleFilterChange(filter.queryKey, value)
                }
              >
                <SelectTrigger className="focus:ring-0 rounded-lg w-fit min-w-[120px]">
                  <SelectValue placeholder={`Filter by ${filter.queryKey}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All"}>All</SelectItem>
                  {filter.options.map((option, i) => (
                    <SelectItem className="text-subtext" key={i} value={option}>
                      {option &&
                        option.charAt(0).toUpperCase() +
                          option.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
      </div>

      {selectedCount > 0 && (
        <AlertDialog>
          <AlertDialogTrigger className="h-full">
            <Button
              variant="destructive"
              className="flex gap-2 h-full transition-all ease-linear rounded-full"
            >
              <Trash2 size={18} />
              <span className="hidden md:block">
                {isAllSelected ? "Delete All" : "Delete Selected"}
              </span>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-xl w-[calc(100vw-20px)] sm:w-full">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your selected users.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-500"
                onClick={onDeleteSelected}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Operations;
