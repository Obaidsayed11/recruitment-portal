"use client";
import InputField from "@/components/Form_Fields/InputField";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import PermissionsManager from "@/components/Others/PermissionManager";
import apiClient from "@/lib/axiosInterceptor";
import { GroupPermission, Permission } from "@/types/UserTabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  clientId: z.string().optional(),
  permissionIds: z
    .array(z.string().uuid())
    .min(1, "At least one permission must be selected."),
});

type CreateGroupInput = z.infer<typeof groupSchema>;

const UpdateGroupsRoute = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );

  const router = useRouter();

  const { data: session } = useSession();
  const params = useParams();

  const searchParams = useSearchParams();

  const a = searchParams?.get("a");
  const b = searchParams?.get("b");

  const clientId = params?.cid as string;
  const id = params?.id as string;

  const methods = useForm<CreateGroupInput>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", permissionIds: [] },
  });

  const { handleSubmit, reset, setValue, trigger } = methods;

  // Fetch group data and populate form
  useEffect(() => {
    if (session && id) {
      const fetchGroupData = async () => {
        try {
          setIsLoading(true);
          const response = await apiClient.get(`/groups/${id}`);
          const groupPermissions: GroupPermission[] = response.data;

          if (groupPermissions.length > 0) {
            // Get group info from the first item (all should have the same group data)
            const groupInfo = groupPermissions[0].Group;

            // Extract permission IDs
            const permissionIds = groupPermissions.map(
              (item) => item.Permission.id
            );

            // Set form values
            setValue("name", groupInfo.name);
            setValue("permissionIds", permissionIds);
            setSelectedPermissions(new Set(permissionIds));
          }
        } catch (error: any) {
          toast.error("Failed to fetch group data.");
          console.error("Error fetching group data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchGroupData();
    }
  }, [session, id, setValue]);

  // Fetch all available permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await apiClient.get(`/permissions`);
        if (res.status !== 200) throw new Error("Failed to fetch permissions");
        setAllPermissions(res.data.data.permissions);
      } catch (err: any) {
        toast.error("Failed to load permissions.");
        setAllPermissions([]);
      }
    };
    fetchPermissions();
  }, []);

  // Update form when selected permissions change
  useEffect(() => {
    setValue("permissionIds", Array.from(selectedPermissions));
    trigger("permissionIds");
  }, [selectedPermissions, setValue, trigger]);

  const handleRemovePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    newSelected.delete(permissionId);
    setSelectedPermissions(newSelected);
  };

  const selectedPermissionObjects = useMemo<Permission[]>(() => {
    return allPermissions?.filter((p) => selectedPermissions.has(p.id));
  }, [allPermissions, selectedPermissions]);

  const onSubmit: SubmitHandler<CreateGroupInput> = async (data) => {
    try {
      setIsSubmitting(true);

      // Use PUT/PATCH for update instead of POST
      const response = await apiClient.put(`/groups/${id}`, data);
      if (response.status === 200 || response.status === 201) {
        router.push(`/settings?a=${a}&tabs=groups`);
        toast.success(response.data?.message || "Group updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading group data...</p>
        </div>
      </div>
    );
  }

  const links = [
    {
      label: `Groups`,
      href: `/settings?tabs=Groups`,
    },
    { label: "Update Groups" },
  ];

  return (
    <>
      <DynamicBreadcrumb links={links} />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-100px)] overflow-auto p-4 md:p-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 border rounded-lg bg-white">
              <InputField
                label="Group Name"
                name={"name"}
                placeholder={"Enter a name for the group"}
              />
            </div>
            <PermissionsManager
              allPermissions={allPermissions}
              selectedPermissions={selectedPermissions}
              onSelectionChange={setSelectedPermissions}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="p-6 border rounded-lg bg-white sticky top-4">
              <h3 className="text-base text-text font-medium mb-4 border-b pb-2">
                Selected Permissions ({selectedPermissions.size})
              </h3>
              {methods.formState.errors.permissionIds && (
                <p className="text-sm text-red-500 mb-4">
                  {methods.formState.errors.permissionIds.message}
                </p>
              )}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {selectedPermissionObjects?.length > 0 ? (
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
              <Button
                className="w-full mt-6"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating Group..." : "Update Group"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default UpdateGroupsRoute;
