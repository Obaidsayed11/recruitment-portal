"use client";
import apiClient from "@/lib/axiosInterceptor";
import { GroupProps } from "@/types/UserTabs"; // Assuming a Group type { id: string, name: string }
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Button from "@/components/Others/Button";

const assignGroupsSchema = z.object({
  groupIds: z
    .array(z.string().uuid())
    .min(1, "At least one group must be selected."),
});

type AssignGroupInput = z.infer<typeof assignGroupsSchema>;

const AssignGroupsTab = () => {
  const [allGroups, setAllGroups] = useState<GroupProps[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(
    new Set()
  );

  const params = useParams();
  const pathname = usePathname(); // 2. Get the current URL path
  const clientId = params?.cid as string;
  const searchParams = useSearchParams();

  const userId = useMemo(() => {
    // Get both potential IDs from the URL parameters
    const idFromParams = params?.id as string;
    const uidFromParams = params?.uid as string;

    // Priority 1: If an 'id' is in the URL, always use it.
    if (idFromParams) {
      return idFromParams;
    }

    // Priority 2: If no 'id', check for 'uid' in the URL.
    if (uidFromParams) {
      return uidFromParams;
    }

    // Priority 3: If no ID is in the URL, check if the path is for user management
    // and fall back to localStorage (for the create-then-assign flow).
    if (pathname?.endsWith("/users/create-user")) {
      if (typeof window !== "undefined") {
        return searchParams?.get("userId");
      }
    }

    // Default to null if no ID can be found
    return null;
  }, [params?.id, params?.uid, pathname, searchParams]); // Add params.uid to the dependency array

  const methods = useForm<AssignGroupInput>({
    resolver: zodResolver(assignGroupsSchema),
    defaultValues: { groupIds: [] },
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  // **FIXED**: This hook now fetches both all available groups AND the user's assigned groups.
  useEffect(() => {
    // if (!clientId || !id || !userId) return;

    const fetchInitialData = async () => {
      try {
        // Fetch both data sets at the same time for better performance
        const [allGroupsRes, userGroupsRes] = await Promise.all([
          apiClient.get(
            `/filters/groups?clientId=${clientId ? clientId : null}`
          ),
          apiClient.get(`/users/${userId}/groups`), // Endpoint to get user's assigned groups
        ]);
        const allGroupsData =
          allGroupsRes.data.groups || allGroupsRes.data || [];
        const userGroupsData =
          userGroupsRes.data.groups || userGroupsRes.data || [];

        // 1. Set the list of all available groups
        setAllGroups(allGroupsData);

        // 2. Create a Set of IDs from the user's currently assigned groups
        const initialSelectedIds: any = new Set(
          userGroupsData.map((g: GroupProps) => g.id)
        );

        // 3. Set the initial selection state, which will pre-check the boxes
        setSelectedGroupIds(initialSelectedIds);
      } catch (err: any) {
        toast.error("Failed to load group data.");
        setAllGroups([]);
      }
    };
    fetchInitialData();
  }, [clientId, userId]);

  // Sync the Set state with react-hook-form state for validation
  useEffect(() => {
    setValue("groupIds", Array.from(selectedGroupIds));
    trigger("groupIds");
  }, [selectedGroupIds, setValue, trigger]);

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(groupId)) {
        newSelected.delete(groupId);
      } else {
        newSelected.add(groupId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedGroupIds(new Set(allGroups.map((g) => g.id)));
    } else {
      setSelectedGroupIds(new Set());
    }
  };

  const handleRemoveGroup = (groupId: string) => {
    handleToggleGroup(groupId);
  };

  const selectedGroupObjects = useMemo<GroupProps[]>(() => {
    return allGroups.filter((g) => selectedGroupIds.has(g.id));
  }, [allGroups, selectedGroupIds]);

  const onSubmit: SubmitHandler<AssignGroupInput> = async (data) => {
    try {
      // **NOTE**: The endpoint uses the `id` from params (the user ID)
      const response = await apiClient.put(`/users/${userId}/groups`, data);

      if (response.status === 200) {
        toast.success(response.data.message || "Groups assigned successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const isAllSelected =
    allGroups.length > 0 && selectedGroupIds.size === allGroups.length;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:max-h-[400px] mt-4"
      >
        <div className="p-4 border rounded-lg bg-white space-y-4 h-full lg: max-h-[300px] flex flex-col">
          <h3 className="text-base text-text font-medium border-b pb-2">
            Available Groups
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="select-all-groups"
              className="h-4 w-4 rounded border-gray-300"
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <label htmlFor="select-all-groups" className="font-medium text-sm">
              Select All
            </label>
          </div>
          <div className="flex-grow overflow-y-auto space-y-2">
            {allGroups.map((group) => (
              <div key={group.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={group.id}
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedGroupIds.has(group.id)}
                  onChange={() => handleToggleGroup(group.id)}
                />
                <label htmlFor={group.id} className="text-sm cursor-pointer">
                  {group.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-white h-full flex flex-col">
          <h3 className="text-base text-text font-medium mb-2 border-b pb-2">
            Selected Groups ({selectedGroupIds.size})
          </h3>
          {errors.groupIds && (
            <p className="text-sm text-red-500 mb-2">
              {errors.groupIds.message}
            </p>
          )}
          <div className="flex-grow max-h-[150px] overflow-y-auto space-y-2 mb-4">
            {selectedGroupObjects.length > 0 ? (
              selectedGroupObjects.map((group) => (
                <div
                  key={group.id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span className="text-sm">{group.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(group.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No groups selected.</p>
            )}
          </div>
          <Button
            className="w-full mt-auto"
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Assigning..." : "Assign Groups"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AssignGroupsTab;
