"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";

// Roles enum
const rolesOptions = ["WAREHOUSE", "DRIVER", "OUTLET", "DISPATCHER"] as const;
const RolesEnum = z.enum(rolesOptions);
type Role = z.infer<typeof RolesEnum>;

// Zod schema for edit
const editDepartmentSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  role: RolesEnum.optional(), 
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  email: z.string().email("Invalid email."),
});

type EditDepartmentFormValues = z.infer<typeof editDepartmentSchema>;

interface EditDepartmentProps {
  id: string | number;
  data: EditDepartmentFormValues;
  onUpdate: (updated: any) => void;
}

const EditDepartment: React.FC<EditDepartmentProps> = ({ id, data, onUpdate }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<EditDepartmentFormValues>({
    resolver: zodResolver(editDepartmentSchema),
    defaultValues: {
      fullName: "",
      role: undefined,
      phone: "",
      email: "",
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  // Populate form when data or modal opens
  useEffect(() => {
    if (data && isOpen) {
      setValue("fullName", data.fullName ?? "");
      setValue("phone", data.phone ?? "");
      setValue("email", data.email ?? "");

      // Validate role enumz`
      if (rolesOptions.includes(data.role as any)) {
        setValue("role", data.role as Role);
      } else {
        setValue("role", undefined);
      }
    }
  }, [data, isOpen, setValue]);

  const roleSelectOptions = rolesOptions.map((v) => ({
    label: v[0] + v.slice(1).toLowerCase(),
    value: v,
  }));

  const onSubmit: SubmitHandler<EditDepartmentFormValues> = async (formData) => {
    try {
      setIsClicked(true);
      const response = await apiClient.put(`/departments/${id}`, formData);

      if ((response as any).status === 200 || (response as any).status === 201) {
        toast.success((response as any).data.message || "Department updated successfully!");
        onUpdate((response as any).data.department || response.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error((response as any).data.message || "Update failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Update failed.");
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Department"
      className="bg-secondary absolute top-5 right-5"
      name="Edit Department"
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <InputField label="Full Name" name="fullName" placeholder="Enter Full Name" />
          <SelectField label="Role" name="role" placeholder="Select Role" options={roleSelectOptions} />
          <InputField label="Phone" name="phone" placeholder="Enter Phone" />
          <InputField label="Email" name="email" placeholder="Enter Email" />
          <Button type="submit" className="sm:col-span-2" disabled={isClicked}>
            {isClicked ? "Updating..." : "Update Department"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditDepartment;
