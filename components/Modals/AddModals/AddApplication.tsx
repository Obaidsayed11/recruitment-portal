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

const addApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required."),
  companyId: z.string().min(1, "Company ID is required."),
  candidateName: z.string().min(1, "Candidate Name is required."),
  email: z.string().email("Invalid email."),
  phone: z.string().min(10, "Phone must be at least 10 digits."),
  currentCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
});

type AddApplicationFormValues = z.infer<typeof addApplicationSchema>;

const AddApplication: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddApplicationFormValues>({
    resolver: zodResolver(addApplicationSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<AddApplicationFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const response = await apiClient.post("/applications", data);
      toast.success(response.data.message || "Application added successfully!");
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
    // <DialogModal open={isOpen} onOpenChange={setIsOpen} title="Add Application" icon={<Plus />}  className="bg-secondary absolute top-5 right-5">
      <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={"Add Application"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add User"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <InputField label="Job ID" name="jobId" placeholder="Enter Job ID" />
          <InputField label="Company ID" name="companyId" placeholder="Enter Company ID" />
          <InputField label="Candidate Name" name="candidateName" placeholder="Enter Name" />
          <InputField label="Email" name="email" placeholder="Enter Email" />
          <InputField label="Phone" name="phone" placeholder="Enter Phone" />
          <InputField label="Current CTC" name="currentCTC" placeholder="Current CTC" />
          <InputField label="Notice Period" name="noticePeriod" placeholder="Notice Period" />
          <InputField label="Status" name="status" placeholder="Status" />
          <InputField label="Source" name="source" placeholder="Source" />
          <Button type="submit" className="sm:col-span-2" disabled={isClicked}>
            {isClicked ? "Adding..." : "Add Application"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddApplication;
