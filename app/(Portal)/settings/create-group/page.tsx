"use client";
import InputField from "@/components/Form_Fields/InputField";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import PermissionsManager from "@/components/Others/PermissionManager";
import apiClient from "@/lib/axiosInterceptor";
import { Permission } from "@/types/UserTabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { permission } from "process";
import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  // This will now correctly be an array of permission IDs (UUIDs)
  permissionIds: z
    .array(z.string().uuid())
    .min(1, "At least one permission must be selected."),
});

type CreateGroupInput = z.infer<typeof groupSchema>;

const CreateGroupsRoute = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
          const res = await apiClient.get(`/permissions`);
        if (res.status !== 200) throw new Error("Failed to fetch permissions");
        setAllPermissions(res.data?.data?.permissions);
      } catch (err: any) {
        toast.error("Failed to load permissions.");
        setAllPermissions([]);
      }
    };
    fetchPermissions();
  }, []);

  const methods = useForm<CreateGroupInput>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", permissionIds: [] },
  });

  const { handleSubmit, reset, setValue, trigger } = methods;

  useEffect(() => {
    setValue("permissionIds", Array.from(selectedPermissions));
    trigger("permissionIds");
  }, [selectedPermissions, setValue, trigger]);

  // **FIXED**: This now correctly expects and deletes a permission ID
  const handleRemovePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    newSelected.delete(permissionId);
    setSelectedPermissions(newSelected);
  };

  const selectedPermissionObjects = useMemo<Permission[]>(() => {
    // **FIXED**: Filters by `p.id` to match the data in the Set
    return allPermissions?.filter((p) => selectedPermissions.has(p.id));
  }, [allPermissions, selectedPermissions]);

  const onSubmit: SubmitHandler<CreateGroupInput> = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post("/group", data);
      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || "Group created successfully!");
        reset();
        router.back();
        setSelectedPermissions(new Set());
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("allPermissions", allPermissions)

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Groups", href: "/settings?tabs=Groups" },
          { label: "Create Group" },
        ]}
      />
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
            {/* **FIXED**: Pass the fetched permissions list down as a prop */}
            <PermissionsManager
              allPermissions={allPermissions}
              selectedPermissions={selectedPermissions}
              onSelectionChange={setSelectedPermissions}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="p-6 border  rounded-lg bg-white sticky top-4">
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
                  selectedPermissionObjects?.map((permission) => (
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
                {isSubmitting ? "Creating Group..." : "Create Group"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateGroupsRoute;
