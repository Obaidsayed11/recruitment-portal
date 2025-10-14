"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UploadCloud } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UpdateJobDescriptionProps } from "@/types/interface";

const employmentOptions = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;
const publishedOptions = ["YES", "NO"] as const;
const statusOptions = ["ACTIVE", "INACTIVE", "DRAFT"] as const;

const EditJobSchema = z.object({
  companyId: z.string().min(1, "Company ID is required."),
  jobTitle: z.string().min(1, "Job Title is required."),
  department: z.string().optional(),
  location: z.string().optional(),
  experienceRequired: z.string().optional(),
  salaryRange: z.string().optional(),
  employmentType: z.enum(employmentOptions).optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  createdBy: z.string().optional(),
  published: z.enum(publishedOptions).optional(),
  status: z.enum(statusOptions).optional(),
  image: z.any().optional(),
});

type EditJobDescriptionFormValues = z.infer<typeof EditJobSchema>;

const EditJobDescription: React.FC<UpdateJobDescriptionProps> = ({ onUpdate, data, id }) =>{
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const methods = useForm<EditJobDescriptionFormValues>({
    resolver: zodResolver(EditJobSchema),
    defaultValues: {
      companyId: "",
      jobTitle: "",
      department: "",
      location: "",
      experienceRequired: "",
      salaryRange: "",
      employmentType: undefined,
      description: "",
      responsibilities: "",
      requirements: "",
      createdBy: "",
      published: undefined,
      status: undefined,
      image: undefined,
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  // Populate form on open or when data changes
useEffect(() => {
  if (data && isOpen) {
    setValue("companyId", data.company_id ?? "");
    setValue("jobTitle", data.job_title ?? "");
    setValue("department", data.department ?? "");
    setValue("location", data.location ?? "");
    setValue("experienceRequired", data.experience_required ?? "");
    setValue("salaryRange", data.salary_range ?? "");

    // Validate employmentType
    const employmentValues = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;
    if (employmentValues.includes(data.employment_type as any)) {
      setValue("employmentType", data.employment_type as typeof employmentValues[number]);
    } else {
      setValue("employmentType", undefined);
    }

    setValue("description", data.description ?? "");
    setValue("responsibilities", data.responsibilities ?? "");
    setValue("requirements", data.requirements ?? "");
    setValue("createdBy", data.created_by ?? "");

    // Published as enum "YES"/"NO"
    setValue("published", data.published ? "YES" : "NO");

    // Validate status
    const statusValues = ["ACTIVE", "INACTIVE", "DRAFT"] as const;
    if (statusValues.includes(data.status as any)) {
      setValue("status", data.status as typeof statusValues[number]);
    } else {
      setValue("status", undefined);
    }
  }
}, [data, isOpen, setValue]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        toast.error("File size exceeds 1MB limit.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setValue("image", file);
    }
  };

  const onSubmit: SubmitHandler<EditJobDescriptionFormValues> = async (formData) => {
    try {
      setIsClicked(true);
      const payload = new FormData();
      payload.append("companyId", formData.companyId);
      payload.append("jobTitle", formData.jobTitle);
      if (formData.department) payload.append("department", formData.department);
      if (formData.location) payload.append("location", formData.location);
      if (formData.experienceRequired) payload.append("experienceRequired", formData.experienceRequired);
      if (formData.salaryRange) payload.append("salaryRange", formData.salaryRange);
      if (formData.employmentType) payload.append("employmentType", formData.employmentType);
      if (formData.description) payload.append("description", formData.description);
      if (formData.responsibilities) payload.append("responsibilities", formData.responsibilities);
      if (formData.requirements) payload.append("requirements", formData.requirements);
      if (formData.createdBy) payload.append("createdBy", formData.createdBy);
      if (formData.published) payload.append("published", formData.published);
      if (formData.status) payload.append("status", formData.status);
      if (selectedFile) payload.append("image", selectedFile);

      const response = await apiClient.put(`/admin/job-description/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ((response as any).status === 200 || (response as any).status === 201) {
        toast.success((response as any).data?.message || "Job updated successfully");
        onUpdate((response as any).data?.job ?? response.data);
        setIsOpen(false);
        reset();
        setSelectedFile(null);
      } else {
        toast.error((response as any).data?.message || "Failed to update job");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Update failed");
    } finally {
      setIsClicked(false);
    }
  };

  const employmentSelect = employmentOptions.map((v) => ({ label: v.replace("_", " "), value: v }));
  const publishedSelect = publishedOptions.map((v) => ({ label: v, value: v }));
  const statusSelect = statusOptions.map((v) => ({ label: v, value: v }));

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={"Edit Job Description"}
      className="bg-secondary absolute top-5 right-5"
      name={"Edit Job"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
          <InputField label="Company ID" name="companyId" placeholder="Enter Company ID" formItemClassName="sm:col-span-2" />
          <InputField label="Job Title" name="jobTitle" placeholder="Enter Job Title" formItemClassName="sm:col-span-2" />

          <InputField label="Department" name="department" placeholder="Department" />
          <InputField label="Location" name="location" placeholder="Location" />

          <InputField label="Experience Required" name="experienceRequired" placeholder="Experience e.g. 3-5 years" />
          <InputField label="Salary Range" name="salaryRange" placeholder="Salary Range" />

          <SelectField label="Employment Type" name="employmentType" placeholder="Select Type" options={employmentSelect} />
          <InputField label="Created By" name="createdBy" placeholder="Created By" />

          <FormItem className="gap-2 grid sm:col-span-2">
            <FormLabel className="text-text text-sm">Job Image / Attachment</FormLabel>
            <FormControl>
              <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                onClick={() => document.getElementById("job-image-upload")?.click()}
              >
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500">JPEG / PDF (max. 1MB)</p>
                <input id="job-image-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                {selectedFile && <p className="mt-2 text-sm text-green-600">{selectedFile.name} selected</p>}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <InputField label="Description" name="description" placeholder="Short Description" formItemClassName="sm:col-span-2" />
          <InputField label="Responsibilities" name="responsibilities" placeholder="Responsibilities" />
          <InputField label="Requirements" name="requirements" placeholder="Requirements" />

          <SelectField label="Published" name="published" placeholder="Published?" options={publishedSelect} />
          <SelectField label="Status" name="status" placeholder="Status" options={statusSelect} />

          <Button type="submit" className="rounded-full justify-self-end mt-4 w-fit sm:col-span-2" disabled={isClicked || methods.formState.isSubmitting}>
            {methods.formState.isSubmitting || isClicked ? "Updating..." : "Update Job"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditJobDescription;
