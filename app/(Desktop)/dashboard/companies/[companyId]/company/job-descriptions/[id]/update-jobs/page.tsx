"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import TextareaField from "@/components/Form_Fields/TextareaField";
import apiClient from "@/lib/axiosInterceptor";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import CustomEditorWrapper from "@/components/CustomEditorWrapper";

const employmentOptions = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
] as const;

const statusOptions = ["ACTIVE", "CLOSED", "DRAFT"] as const;

const EditJobSchema = z.object({
  title: z.string().min(1, "Job Title is required."),
  departmentId: z.string().min(1, "Department is required."),
  location: z.string().min(1, "Location is required."),
  experience: z.string().optional(),
  salaryRange: z.string().optional(),
  employmentType: z.enum(employmentOptions),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  status: z.enum(statusOptions),
});

type EditJobDescriptionFormValues = z.infer<typeof EditJobSchema>;

const UpdateJobRoute = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);

  const companyId = params?.companyId as string;
  const jobId = (params?.id as string) || (params?.uid as string);

  const methods = useForm<EditJobDescriptionFormValues>({
    resolver: zodResolver(EditJobSchema),
    defaultValues: {
      title: "",
      departmentId: "",
      location: "",
      experience: "",
      salaryRange: "",
      employmentType: "FULL_TIME",
      description: "",
      responsibilities: "",
      requirements: "",
      status: "ACTIVE",
    },
  });

  const { handleSubmit, reset, control, setValue } = methods;

  console.log("Job data:", jobData);

  // Fetch departments for dropdown
  useEffect(() => {
    if (!companyId) return;

    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get(
          `/department/filter?companyId=${companyId}`
        );
        setDepartments(res.data.data || []);
        console.log("Departments:", res.data.data);
      } catch (error) {
        toast.error("Failed to fetch departments");
      }
    };

    fetchDepartments();
  }, [companyId]);

  // Fetch job data
  useEffect(() => {
    if (!jobId || !companyId) return;

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/job/${jobId}`);
        const fetchedJob =
          response.data?.job || response.data?.data || response.data;

        console.log("Full API Response:", response.data);
        console.log("Extracted job data:", fetchedJob);

        if (fetchedJob) {
          setJobData(fetchedJob);

          // Populate form with fetched data
          const formData = {
            title: fetchedJob.title || "",
            departmentId:
              fetchedJob.departmentId || fetchedJob.Department?.id || "",
            location: fetchedJob.location || "",
            experience: fetchedJob.experience || "",
            salaryRange: fetchedJob.salaryRange || "",
            employmentType: (fetchedJob.employmentType ||
              "FULL_TIME") as (typeof employmentOptions)[number],
            description: fetchedJob.description || "",
            responsibilities: fetchedJob.responsibilities || "",
            requirements: fetchedJob.requirements || "",
            status: (fetchedJob.status ||
              "ACTIVE") as (typeof statusOptions)[number],
          };

          console.log("Populating form with:", formData);
          reset(formData);
        } else {
          toast.error("Job data not found in response");
        }
      } catch (error: any) {
        toast.error("Failed to fetch job data.");
        console.error("Fetch job error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId, companyId, reset]);

  const onSubmit: SubmitHandler<EditJobDescriptionFormValues> = async (
    formData
  ) => {
    try {
      console.log("Submitting form data:", formData);
      setIsSubmitting(true);
      // Function to remove HTML tags from rich text fields
      

      const payload = {
        title: formData.title,
        departmentId: formData.departmentId,
        location: formData.location,
        experience: formData.experience,
        salaryRange: formData.salaryRange,
        employmentType: formData.employmentType,
        description: formData.description,
        status: formData.status,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
      };

      console.log("Sending PUT request to:", `/job/${jobId}`);

      const response = await apiClient.put(`/job/${jobId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Update response:", response.data);
      toast.success(response.data.message || "Job updated successfully!");

      // Navigate back to jobs list
      router.push(`/dashboard/companies/${companyId}?tab=job`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const employmentSelect = employmentOptions.map((v) => ({
    label: v.replace("_", " "),
    value: v,
  }));

  const statusSelect = statusOptions.map((v) => ({
    label: v,
    value: v,
  }));
  // ACTIVE CLOSED DRAFT

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Jobs", href: `/dashboard/companies/${companyId}?tab=job` },
          { label: "Edit Job" },
        ]}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5"
        >
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <h2 className="text-xl font-bold text-text">Edit Job Details</h2>

            {isLoading ? (
              <div className="text-center py-4">Loading job data...</div>
            ) : (
              <>
                <div className="gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField
                      label="Job Title"
                      name="title"
                      placeholder="Enter Job Title"
                    />

                    <FormField
                      control={control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-fontPrimary">
                            Department
                          </FormLabel>
                          <FormControl>
                            <Combobox
                              placeholder="Select Department"
                              options={departments.map((dep) => ({
                                value: dep.id,
                                label: dep.name,
                              }))}
                              value={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <InputField
                      label="Location"
                      name="location"
                      placeholder="Enter location"
                    />
                    <InputField
                      label="Experience Required"
                      name="experience"
                      placeholder="e.g. 3-5 years"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <InputField
                      label="Salary Range"
                      name="salaryRange"
                      placeholder="Enter salary range"
                    />
                    <SelectField
                      label="Employment Type"
                      name="employmentType"
                      placeholder="Select Type"
                      options={employmentSelect}
                    />
                  </div>
                  {/* ✅ Status Dropdown Added */}
                  <div className="grid sm:grid-cols-1 gap-5 mt-4">
                    <SelectField
                      label="Job Status"
                      name="status"
                      placeholder="Select Status"
                      options={statusSelect}
                    />
                  </div>

                  <div className="mt-4">
                    {/* <TextareaField
                      label="Description"
                      name="description"
                      placeholder="Enter job description"
                    /> */}
                    <div className="sm:col-span-2 text-text font-medium text-sm mb-4">
                    <h1 className="mb-2">
                            Description <span className="text-red-500 ml-1">*</span>
                          </h1>
                      <CustomEditorWrapper
                        control={methods.control}
                        name="description"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <TextareaField
                      label="Responsibilities"
                      name="responsibilities"
                      placeholder="Enter responsibilities"
                    />
                  </div>

                  <div className="mt-4">
                    <TextareaField
                      label="Requirements"
                      name="requirements"
                      placeholder="Enter requirements"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-fit justify-self-end mt-4"
                  >
                    {isSubmitting ? "Updating..." : "Update Job"}
                  </Button>
                </div>
              </>
            )}
          </section>
        </form>
      </FormProvider>
    </>
  );
};

export default UpdateJobRoute;
