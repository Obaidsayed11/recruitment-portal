"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";
import { UpdateDepartmentProps } from "@/types/companyInterface";

// Roles enum
const rolesOptions = ["WAREHOUSE", "DRIVER", "OUTLET", "DISPATCHER"] as const;
const RolesEnum = z.enum(rolesOptions);
type Role = z.infer<typeof RolesEnum>;

// Zod schema for edit
const editDepartmentSchema = z.object({
  name: z.string().min(1, "Full Name is required."),
  description: z.string(),
});

type EditDepartmentFormValues = z.infer<typeof editDepartmentSchema>;



const EditDepartment: React.FC<UpdateDepartmentProps> = ({
  id,
  data,
  onUpdate,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);

  const methods = useForm<EditDepartmentFormValues>({
    resolver: zodResolver(editDepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  // Populate form when data or modal opens
  useEffect(() => {
    if (data && isFirstDialogOpen) {
      setValue("name", data.name ?? "");
      setValue("description", data.description ?? "");
    }
  }, [data, isFirstDialogOpen, setValue]);

  const roleSelectOptions = rolesOptions.map((v) => ({
    label: v[0] + v.slice(1).toLowerCase(),
    value: v,
  }));

  const onSubmit: SubmitHandler<EditDepartmentFormValues> = async (
    data
  ) => {
    try {
      setIsClicked(true);
       const payload = {
      name: data.name,
      description: data.description,
    };

    const response = await apiClient.put(`/department/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

      if (
        (response as any).status === 200 ||
        (response as any).status === 201
      ) {
        toast.success(
          (response as any).data.message || "Department updated successfully!"
        );
        onUpdate((response as any).data.department || response.data);
        setIsFirstDialogOpen(false);
        reset();
      } else {
        toast.error((response as any).data.message || "Update failed.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Update failed."
      );
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isFirstDialogOpen}
      onOpenChange={setIsFirstDialogOpen}
      title="Edit Department"
      icon={<Pencil size={18} />}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <InputField
            label="Department Name"
            name="name"
            placeholder="Enter Full Name"
          />
          <InputField label="Description" name="description" placeholder="Enter Description" />
          <Button type="submit" className="sm:col-span-2 w-fit justify-self-end" disabled={isClicked}>
            {isClicked ? "Updating..." : "Update Department"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditDepartment;
