
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
import { id } from "zod/v4/locales";
import { UpdateGroupProps } from "@/types/settingsinterface";

// --- Schema ---
const EditGroupSchema = z.object({
    id: z.string().min(1,"id is required"),
  group_name: z.string().min(1, "Group Name is required"),
});

type EditGroupFormValues = z.infer<typeof EditGroupSchema>;


const EditGroup: React.FC<UpdateGroupProps> = ({ id, data, onUpdate }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm<EditGroupFormValues>({
    resolver: zodResolver(EditGroupSchema),
    defaultValues: {
      group_name: "",
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  // Populate form when modal opens
  useEffect(() => {
    if (data && isModalOpen) {
      setValue("group_name", data.group_name);
    }
  }, [data, isModalOpen, setValue]);

  const onSubmit: SubmitHandler<EditGroupFormValues> = async (formData) => {
    try {
      setIsClicked(true);
      const payload = new FormData();
      payload.append("id", formData.id)
      payload.append("group_name", formData.group_name)

      const response = await apiClient.put(`/groups/${id}`, formData);

      toast.success(response.data.message || "Group updated successfully!");
     if ((response as any).status === 200 || (response as any).status === 201) {
           toast.success((response as any).data?.message || "Groups updated successfully");
           onUpdate((response as any).data?.groups ?? response.data);
           setIsModalOpen(false);
           reset();
          
         } else {
           toast.error((response as any).data?.message || "Failed to update Groups");
         }
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Update failed");
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      title={"Edit Group"}
      name={"Edit Group"}
      icon={<Plus />}
      
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-1">
          <InputField
            label="Group Name"
            name="group_name"
            placeholder="Enter Group Name"
          />

          <Button
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
            className="mt-4 w-fit"
          >
            {methods.formState.isSubmitting || isClicked ? "Updating..." : "Update Group"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditGroup;
