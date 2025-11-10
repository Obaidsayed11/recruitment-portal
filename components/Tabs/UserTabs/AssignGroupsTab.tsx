  "use client";
  import apiClient from "@/lib/axiosInterceptor";
  import { GroupProps } from "@/types/UserTabs";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { X } from "lucide-react";
  import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
  import React, { useState, useEffect, useMemo } from "react";
  import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
  import { toast } from "sonner";
  import { z } from "zod";
  import Button from "@/components/Others/Button";
  import { hasPermission } from "@/lib/hasPermission";
  import { usePermissions } from "@/components/PermissionContext";
  

  const assignGroupsSchema = z.object({
    groupIds: z
      .array(z.string())
      .min(1, "At least one group must be selected."),
  });

  interface AssignGroupsTabProps {
    userId?: string;
  }

  type AssignGroupInput = z.infer<typeof assignGroupsSchema>;

  const AssignGroupsTab: React.FC<AssignGroupsTabProps> = ({ userId: propUserId }) => {
    const [allGroups, setAllGroups] = useState<GroupProps[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
      const [userIdData, setUserIdData] = useState(false);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const searchParams = useSearchParams();
      const router = useRouter();
      const { permissions } = usePermissions();

    const params = useParams();
    const pathname = usePathname(); // 2. Get the current URL path
    
    
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
    }, [params?.id, params?.uid, pathname, userIdData, searchParams]); // Add params.uid to the dependency array;

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

    // Fetch all groups and user's assigned groups
    useEffect(() => {
      // if (!userId) {
      //   console.warn("No userId available yet");
      //   return;
      // }

      const fetchInitialData = async () => {
        try {
          setIsLoadingGroups(true);
          console.log("Fetching groups data for userId:", userId);

          // Fetch all available groups and user's assigned groups
          const [allGroupsRes, userGroupsRes] = await Promise.all([
            apiClient.get(`/groups?page=1&limit=100`),
            apiClient.get(`/user-groups/${userId}`),
          ]);

          console.log("All Groups Response:", allGroupsRes.data);
          console.log("User Groups Response:", userGroupsRes.data);

          // Extract groups from paginated response
          // const allGroupsData: GroupProps[] = allGroupsRes.data.groups || [];

          // // Extract user's assigned groups (direct array response)
          // const userGroupsData: GroupProps[] = Array.isArray(userGroupsRes.data)
          //   ? userGroupsRes.data
          //   : userGroupsRes.data.groups || [];

          // console.log("Extracted All Groups:", allGroupsData);
          // console.log("Extracted User's Groups:", userGroupsData);

          // // Set all available groups
          // setAllGroups(allGroupsData);

          // // Create a Set of IDs from the user's currently assigned groups
          // const initialSelectedIds = new Set(
          //   userGroupsData.map((g: GroupProps) => g.id)
          // );

          // console.log("Initial Selected Group IDs:", Array.from(initialSelectedIds));

          // // Set the initial selection state
          // setSelectedGroupIds(initialSelectedIds);
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
          console.error("Failed to load groups:", err);
          console.error("Error response:", err.response?.data);
          toast.error(err.response?.data?.message || "Failed to load group data.");
          setAllGroups([]);
        } finally {
          setIsLoadingGroups(false);
        }
      };

      fetchInitialData();
    }, [userId]);


      useEffect(() => {
        if (permissions && !hasPermission(permissions, "list_jobs")) {
          router.push(`/users/update-user/${userId}`);
        }
      }, [permissions, router]);

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
        console.log("Submitting group assignment:", data);
        
        // PUT request to assign groups to user
        const response = await apiClient.put(`/user-groups/${userId}`, {
          groupIds: data.groupIds,
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message || "Groups assigned successfully!");
        }
      } catch (error: any) {
        console.error("Error assigning groups:", error);
        console.error("Error response:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to assign groups.");
      }
    };

    const isAllSelected =
      allGroups.length > 0 && selectedGroupIds.size === allGroups.length;

    // Show loading state
    if (isLoadingGroups) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">Loading groups...</p>
        </div>
      );
    }

    

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:max-h-[400px] mt-4"
        >
          {/* Left side - Available Groups */}
          <div className="p-4 border rounded-lg bg-white space-y-4 h-full lg:max-h-[300px] flex flex-col">
            <h3 className="text-base text-text font-medium border-b pb-2">
              Available Groups
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="select-all-groups"
                className="h-4 w-4 rounded border-gray-300 accent-primary"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <label htmlFor="select-all-groups" className="font-medium text-sm">
                Select All
              </label>
            </div>
            <div className="flex-grow overflow-y-auto space-y-2">
              {allGroups.length > 0 ? (
                allGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={group.id}
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
                      checked={selectedGroupIds.has(group.id)}
                      onChange={() => handleToggleGroup(group.id)}
                    />
                    <label htmlFor={group.id} className="text-sm cursor-pointer">
                      {group.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No groups available.</p>
              )}
            </div>
          </div>

          {/* Right side - Selected Groups */}
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
              type="button"
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