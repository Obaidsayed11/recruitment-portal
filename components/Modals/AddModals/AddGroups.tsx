// components/Modals/AddModals/AddGroup.tsx
"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import Button from "@/components/Others/Button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// REMOVED: import { Combobox } from "@/components/Others/ComoboboxDemo";

// ✅ Schema updated: permissionIds is now an array
const addGroupSchema = z.object({
  name: z.string().min(1, "Group Name is required."),
  permissionIds: z.array(z.string()).min(1, "Please select at least one permission."),
});

type AddGroupFormValues = z.infer<typeof addGroupSchema>;

const AddGroup: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([]);

  const methods = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: "",
      permissionIds: [],
    },
  });

  const { handleSubmit, reset, control, setValue, watch } = methods;
  // const selectedPermissions = watch("permissionIds"); // Not strictly needed

  // ✅ Fetch permissions list
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await apiClient.get("/permissions");
        if (res?.data) setPermissions(res.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  // ✅ Submit form
  const onSubmit: SubmitHandler<AddGroupFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const payload = {
        name: data.name,
        // The permissionIds array is already correctly formatted by the HTML select element handler
        permissionIds: data.permissionIds, 
      };

      const response = await apiClient.post("/group", payload);
      toast.success(response.data.message || "Group added successfully!");
      onAdd(response.data.group);
      setIsOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Add Group"
      name="Add Group"
      icon={<Plus />}
      className="bg-secondary absolute top-5 right-5"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          {/* Group Name */}
          <InputField label="Group Name" name="name" placeholder="Enter Group Name" />

          {/* Permissions Multi-Select using native <select multiple> */}
          <FormField
            control={control}
            name="permissionIds"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel className="text-fontPrimary">Permissions (Hold Ctrl/Cmd to select multiple)</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    multiple // Key attribute for multi-selection
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling
                    // Set a size to make the multiple selections visible
                    size={Math.min(permissions.length, 6)} 
                    // React Hook Form handles the onChange for multiple select automatically
                    onChange={(e) => {
                        // This converts the HTML collection of selected options into a string array
                        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                        field.onChange(selectedValues);
                    }}
                  >
                    {permissions.map((perm) => (
                      <option key={perm.id} value={perm.id}>
                        {perm.name.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isClicked}
            className="sm:col-span-2 w-fit justify-self-end"
          >
            {isClicked ? "Adding..." : "Add Group"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddGroup;