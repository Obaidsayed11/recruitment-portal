// components/Modals/AddModals/AddGroup.tsx
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
import Button from "@/components/Others/Button";
// import { AddRoleFormValues } from "@/types/settingsinterface";



const addRoleSchema = z.object({
  // id: z.string().optional(), // add this line
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  // roleType: z.string().min(1, "Role Type is required"),
  description: z.string().optional(),
});

type AddRoleFormValues = z.infer<typeof addRoleSchema>

const AddRoles: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddRoleFormValues>({
  resolver: zodResolver(addRoleSchema),
});


  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<AddRoleFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const response = await apiClient.post("/roles/role", data);
      toast.success(response.data.message || "Group added successfully!");
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
    <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Add Roles"
      name="Add Roles"
      icon={<Plus />}
      className="bg-secondary absolute top-5 right-5"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-1">
        <InputField
            label="Role Name"
            name="name"
            placeholder="Enter Group Name"
          />
 <InputField
            label="Role code"
            name="code"
            placeholder="description"
          />
          <InputField
            label="Role Description"
            name="description"
            placeholder="description"
          />
          {/* <InputField
            label="Role type"
            name="roleType"
            placeholder="description"
          /> */}
          <Button type="submit" disabled={isClicked} className="sm:col-span-2 w-fit justify-self-end">
            {isClicked ? "Adding..." : "Add Roles"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddRoles;
