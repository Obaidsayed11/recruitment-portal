"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";
import { AddJobModalProps } from "@/types/companyInterface";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const employmentOptions = ["FULL_TIME", "Contract", "Internship"] as const;

const addJobSchema = z.object({
  // companyId: z.string().min(1, "Company ID is required."),
  title: z.string().min(1, "Job Title is required."),
  department: z.string().min(1, "Department is required."),
  location: z.string().min(1, "Location is required."),
  experience: z.string().optional(),
  salaryRange: z.string().optional(),
  employmentType: z.enum(employmentOptions),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  // published: z.boolean().optional(),
  // status: z.string().optional(),
});

type AddJobDescriptionFormValues = z.infer<typeof addJobSchema>;

const AddJobDescription: React.FC<AddJobModalProps> = ({ onAdd }) => {

   type Props = {
    companyId?: string | null;
  };
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddJobDescriptionFormValues>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      experience: "",
      salaryRange: "",

      description: "",
      responsibilities: "",
      requirements: "",
    },
  });
  const { data: session } = useSession();
    const searchParams = useSearchParams();
    console.log(searchParams,"searfch")
    // console.log(session,"sesdsion")
    // let companyId = session?.user?.companyId ? session?.user?.companyId : ""
  
 

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<AddJobDescriptionFormValues> = async (data) => {
  try {
    setIsClicked(true);
     
    const payload = { ...data,companyId};
    const response = await apiClient.post(`/company/job/${companyId}`, payload);
    console.log(response.data,"afh")
    toast.success(response.data.message || "Job added successfully!");
    onAdd(response.data);
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
      title={"Add Job Description"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add User"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          {/* <InputField label="Company ID" name="companyId" placeholder="Enter Company ID" /> */}
          <InputField
            label="Job Title"
            name="title"
            placeholder="Enter Job Title"
          />
          <InputField
            label="Department"
            name="department"
            placeholder="Enter Department"
          />
          <InputField
            label="Location"
            name="location"
            placeholder="Enter Location"
          />
          <InputField
            label="Experience Required"
            name="experience"
            placeholder="Experience"
          />
          <InputField
            label="Salary Range"
            name="salaryRange"
            placeholder="Salary Range"
          />
          <SelectField
            label="Employment Type"
            name="employmentType"
            placeholder="Select Type"
            options={employmentOptions.map((v) => ({ label: v, value: v }))}
          />
          <InputField
            label="Description"
            name="description"
            placeholder="Job Description"
          />
          <InputField
            label="Responsibilities"
            name="responsibilities"
            placeholder="Responsibilities"
          />
          <InputField
            label="Requirements"
            name="requirements"
            placeholder="Requirements"
          />

          <Button type="submit" className="sm:col-span-2" disabled={isClicked}>
            {isClicked ? "Adding..." : "Add Job"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddJobDescription;
