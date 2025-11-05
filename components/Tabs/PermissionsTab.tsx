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
import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const permissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  // This will now correctly be an array of permission IDs (UUIDs)
  permissionIds: z
    .array(z.string().uuid())
    .min(1, "At least one permission must be selected."),
});

type CreateGroupInput = z.infer<typeof permissionSchema>;

const PermissionTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

  // Fetch permissions here, in the parent component
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await apiClient.get(`/permissions?data=all`);
        if (res.status !== 200) throw new Error("Failed to fetch permissions");
        setAllPermissions(res.data.permissions);
      } catch (err: any) {
        toast.error("Failed to load permissions.");
        setAllPermissions([]);
      }
    };
    fetchPermissions();
  }, []);

  const methods = useForm<CreateGroupInput>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: "", permissionIds: [] },
  });

  const { handleSubmit, reset, setValue, trigger } = methods;

  useEffect(() => {
    setValue("permissionIds", Array.from(selectedPermissions));
    trigger("permissionIds");
  }, [selectedPermissions, setValue, trigger]);

  // *FIXED*: This now correctly expects and deletes a permission ID
  const handleRemovePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    newSelected.delete(permissionId);
    setSelectedPermissions(newSelected);
  };

  const selectedPermissionObjects = useMemo<Permission[]>(() => {
    // *FIXED*: Filters by p.id to match the data in the Set
    return allPermissions.filter((p) => selectedPermissions.has(p.id));
  }, [allPermissions, selectedPermissions]);

  const onSubmit: SubmitHandler<CreateGroupInput> = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post("/groups", data);
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

  return (
    <>
      <div className="grid grid-cols-[1fr_.5fr] gap-5 mt-5">
        <PermissionsManager
          allPermissions={allPermissions}
          selectedPermissions={selectedPermissions}
          onSelectionChange={setSelectedPermissions}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className=" overflow-auto ">
            <div className="p-4 border flex flex-col gap-4 rounded-lg bg-white">
              <InputField
                label="Permission Name"
                name={"name"}
                placeholder={"Enter a name for the permission"}
              />
              <InputField
                label="Permission Code"
                name={"code"}
                placeholder={"Enter a code for the permission"}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Permission Group"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default PermissionTab;
