"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";

const rolesOptions = ["WAREHOUSE", "DRIVER", "OUTLET", "DISPATCHER"] as const;

const addDepartmentSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  role: z.enum(rolesOptions),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  email: z.string().email("Invalid email."),
});

type AddDepartmentFormValues = z.infer<typeof addDepartmentSchema>;

const AddDepartment: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddDepartmentFormValues>({
    resolver: zodResolver(addDepartmentSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<AddDepartmentFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const response = await apiClient.post("/departments", data);
      toast.success(response.data.message || "Department added successfully!");
      onAdd(response.data);
      setIsOpen(false);
      reset();
      setIsClicked(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      setIsClicked(false);
    }
  };

  return (
    // <DialogModal open={isOpen} onOpenChange={setIsOpen} title={"Add Department"} icon={<Plus />} className="bg-secondary absolute top-5 right-5">
    <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={"Add Department"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add User"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <InputField label="Full Name" name="fullName" placeholder="Enter Full Name" />
          <SelectField label="Role" name="role" placeholder="Select Role" options={rolesOptions.map(v => ({ label: v, value: v }))} />
          <InputField label="Phone" name="phone" placeholder="Enter Phone" />
          <InputField label="Email" name="email" placeholder="Enter Email" />
          <Button type="submit" className="sm:col-span-2" disabled={isClicked}>
            {isClicked ? "Adding..." : "Add Department"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddDepartment;
