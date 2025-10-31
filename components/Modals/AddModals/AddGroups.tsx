// components/Modals/AddModals/AddGroup.tsx
"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import Button from "@/components/Others/Button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Schema updated: permissionIds is now an array
const addGroupSchema = z.object({
  name: z.string().min(1, "Group Name is required."),
  permissionIds: z.array(z.string()).min(1, "Please select at least one permission."),
});

type AddGroupFormValues = z.infer<typeof addGroupSchema>;

const AddGroup: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([]);

  const methods = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: "",
      permissionIds: [],
    },
  });

  const { handleSubmit, reset, control, setValue, watch } = methods;
  const selectedPermissions = watch("permissionIds");

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

  // Toggle permission selection
  const togglePermission = (permissionId: string, currentValues: string[]) => {
    if (currentValues.includes(permissionId)) {
      return currentValues.filter((id) => id !== permissionId);
    } else {
      return [...currentValues, permissionId];
    }
  };

  // Get selected permission names for display
  const getSelectedNames = () => {
    return permissions
      .filter((perm) => selectedPermissions.includes(perm.id))
      .map((perm) => perm.name.replace(/_/g, " "));
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-1">
          {/* Group Name */}
          <InputField label="Group Name" name="name" placeholder="Enter Group Name" />

          {/* Permissions Multi-Select with Checkboxes */}
          <FormField
            control={control}
            name="permissionIds"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-fontPrimary">Permissions</FormLabel>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <button
                        type="button"
                        className={cn(
                          "flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                          !field.value?.length && "text-muted-foreground"
                        )}
                      >
                        <div className="flex flex-wrap gap-1">
                          {field.value?.length > 0 ? (
                            getSelectedNames().map((name) => (
                              <h1 key={name}  className="mr-1">
                                {name},
                              </h1>
                            ))
                          ) : (
                            <span>Select permissions...</span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search permissions..." />
                      <CommandEmpty>No permission found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {permissions.map((permission) => {
                          const isSelected = field.value?.includes(permission.id);
                          return (
                            <CommandItem
                              key={permission.id}
                              onSelect={() => {
                                const newValue = togglePermission(permission.id, field.value || []);
                                field.onChange(newValue);
                              }}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? " text-white"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <Check className="h-4 w-4" />
                              </div>
                              <span>{permission.name.replace(/_/g, " ")}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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