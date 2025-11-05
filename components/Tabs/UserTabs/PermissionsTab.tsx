"use client";
import apiClient from "@/lib/axiosInterceptor";
import { Permission } from "@/types/UserTabs"
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Button from "@/components/Others/Button";
import PermissionsManager from "@/components/Others/PermissionManager";

const assignPermissionsSchema = z.object({
  permissionIds: z
    .array(z.string())
    .min(1, "At least one permission must be selected."),
});
interface AssignPermissionsTabProps {
  userId: string;
}

type AssignPermissionsInput = z.infer<typeof assignPermissionsSchema>;

const AssignPermissionsTab = () => {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [userIdData, setUserIdData] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const searchParams = useSearchParams();

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
    if (pathname?.endsWith("dashboard/users/create-user") || userIdData) {
      if (typeof window !== "undefined") {
        return searchParams?.get("userId");
      }
    }

    // Default to null if no ID can be found
    return null;
  }, [params?.id, params?.uid, pathname, userIdData, searchParams]); // Add params.uid to the dependency array

   console.log(userId,"userIdddddddddddddd")

  const methods = useForm<AssignPermissionsInput>({
    resolver: zodResolver(assignPermissionsSchema),
    defaultValues: { permissionIds: [] },
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [allPermissionsRes, userPermissionsRes] = await Promise.all([
          apiClient.get(`/permissions`),
          apiClient.get(`/user-permissions/${userId}`),
        ]);

         // Extract all permissions from response
        // Based on your swagger, the response is directly an array
        // const allPermsData: Permission[] = Array.isArray(allPermissionsRes.data) 
        //   ? allPermissionsRes.data
        //   : allPermissionsRes.data?.data?.permissions || [];

        // // Extract user's assigned permissions
        // const userPermsData: Permission[] = Array.isArray(userPermissionsRes.data)
        //   ? userPermissionsRes.data
        //   :  userPermissionsRes.data?.data?.permissions || [];

           // ✅ Fix: extract permissions properly from `data.permissions`
        const allPermsData: Permission[] =
          allPermissionsRes.data?.data?.permissions || [];

        const userPermsData: Permission[] =
          userPermissionsRes.data?.data?.permissions || [];

  console.log("All Permissions:", allPermsData);
        console.log("User's Assigned Permissions:", userPermsData);

        setAllPermissions(allPermsData);
        console.log(allPermissions,"dguydgyi")
        // const initialSelectedIds = new Set(
        //   userPermsData.map((p: Permission) => p.id)
        // );
        // setSelectedPermissions(initialSelectedIds);
        const initialSelectedIds = new Set(userPermsData.map((p: Permission) => p.id));
        setSelectedPermissions(initialSelectedIds);


      } catch (err: any) {
        toast.error("Failed to load initial permission data.");
        setAllPermissions([]);
      }
    };
    fetchInitialData();
  }, [userId]);
// Update form value whenever selected permissions change
  useEffect(() => {
    setValue("permissionIds", Array.from(selectedPermissions));
    trigger("permissionIds");
  }, [selectedPermissions, setValue, trigger]);

  const handleRemovePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    newSelected.delete(permissionId);
    setSelectedPermissions(newSelected);
  };
  // Get the full permission objects for selected permissions
  const selectedPermissionObjects = useMemo<Permission[]>(() => {
    return allPermissions.filter((p) => selectedPermissions.has(p.id));
  }, [allPermissions, selectedPermissions]);

  const onSubmit: SubmitHandler<AssignPermissionsInput> = async (data) => {
    if (!userId) {
      toast.error("User ID is missing. Cannot save permissions.");
      return;
    }
    try {
       // PUT request to update user permissions
      const response = await apiClient.put(
        `/user-permissions/${userId}`,
        {
          permissionIds: data.permissionIds
        }
      );
      if (response.status === 200 || response.status === 201) {
        setUserIdData(true);

        toast.success(
          response.data.message || "Permissions updated successfully!"
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const onErrors = (errors: any) => {
    console.error("Form Validation Errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      {/* The form tag is still useful for semantics and accessibility */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit, onErrors)();
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[400px] overflow-auto p-2 items-start"
      >
        <PermissionsManager
          allPermissions={allPermissions}
          selectedPermissions={selectedPermissions}
          onSelectionChange={setSelectedPermissions}
        />
        <div className="lg:col-span-1   sticky top-0 ">
          <div className="p-3 border rounded-lg bg-white sticky top-4 max-h-[400px] overflow-auto">
            <h3 className="text-base text-text font-medium mb-4 border-b pb-2">
              Selected Permissions ({selectedPermissions.size})
            </h3>
            {errors.permissionIds && (
              <p className="text-sm text-red-500 mb-4">
                {errors.permissionIds.message}
              </p>
            )}
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {selectedPermissionObjects.length > 0 ? (
                selectedPermissionObjects.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span className="text-sm">{permission.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePermission(permission.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No permissions selected.
                </p>
              )}
            </div>
            {/* Using your custom Button component now with the fix */}
            <Button
              className="w-full mt-6"
              type="button" // This is the most important change
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit, onErrors)}
            >
              {isSubmitting ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AssignPermissionsTab;
