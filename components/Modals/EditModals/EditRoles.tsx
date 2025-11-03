
"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import Button from "@/components/Others/Button";
import { id } from "zod/v4/locales";
import { UpdateGroupProps } from "@/types/settingsinterface";
import { description } from "@/components/Charts/DeliveryTimeChart";

// --- Schema ---
const EditRoleschema = z.object({
    // id: z.string(),
  name: z.string().min(1, "Role Name is required"),
  code: z.string(),
  description: z.string(),
  // roleType: z.string()
});

type EditGroupFormValues = z.infer<typeof EditRoleschema>;


const EditRoles: React.FC<UpdateGroupProps> = ({ id, data, onUpdate }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm<EditGroupFormValues>({
    resolver: zodResolver(EditRoleschema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
  // roleType: ""

    },
  });

  const { handleSubmit, setValue, reset } = methods;

  // Populate form when modal opens
  useEffect(() => {
    if (data && isModalOpen) {
      setValue("name", data.name);
      setValue("code", data.code);
        setValue("description", data.description);
          
    }
  }, [data, isModalOpen, setValue]);

  const onSubmit: SubmitHandler<EditGroupFormValues> = async (formData) => {
    try {
      setIsClicked(true);
      const payload = new FormData();
    //   payload.append("id", formData.id)
      payload.append("name", formData.name)
      payload.append("name", formData.code);
      payload.append("name", formData.description);
      // payload.append("name", formData.roleType);
      const id = data?.id

      const response = await apiClient.put(`/roles/${id}`, formData);

      toast.success(response.data.message || "Group updated successfully!");
     if ((response as any).status === 200 || (response as any).status === 201) {
           toast.success((response as any).data?.message || "Groups updated successfully");
           onUpdate((response as any).data?.role ?? response.data);
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
      title="Edit Roles"
      icon={<Pencil size={18} />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-1">
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
          <Button
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
            className="sm:col-span-2 w-fit justify-self-end"
          >
            {methods.formState.isSubmitting || isClicked ? "Updating..." : "Update Role"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditRoles;
