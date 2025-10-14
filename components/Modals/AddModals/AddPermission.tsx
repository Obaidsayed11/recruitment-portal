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



const addGroupSchema = z.object({
  group_name: z.string().min(1, "Group Name is required."),
});

type AddGroupFormValues = z.infer<typeof addGroupSchema>

const AddPermission: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<AddGroupFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const response = await apiClient.post("/groups", data);
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
      title="Add Permission"
      name="Add Permission"
      icon={<Plus />}
      className="bg-secondary absolute top-5 right-5"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-1">
          <InputField label="Group Name" name="group_name" placeholder="Enter Group Name" />
          <Button type="submit" disabled={isClicked}>
            {isClicked ? "Adding..." : "Add Group"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddPermission;
