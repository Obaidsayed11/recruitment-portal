  "use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UploadCloud } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";
import { AddJobModalProps } from "@/types/companyInterface";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import TextareaField from "@/components/Form_Fields/TextareaField";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import dynamic from "next/dynamic";
import CustomEditorWrapper from "@/components/CustomEditorWrapper";
import { parseJSON } from "date-fns";
import { parseHtml } from "ckeditor5";
import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "@/components/PermissionContext";


// const CustomEditor = dynamic(() => import("@/components/customEditor"), {
//   ssr: false,
// });
const employmentOptions = ["FULL_TIME", "CONTRACT", "INTERNSHIP"] as const;

const addJobSchema = z.object({
  // companyId: z.string().min(1, "Company ID is required."),

  department: z.string().min(1, "Department is required."),
  location: z.string().min(1, "Location is required."),
  experience: z.string().optional(),
  salaryRange: z.string().optional(),
  employmentType: z.enum(employmentOptions),
  description: z.string().min(20, "Description Should not be less than 20"),
  content: z.string().min(50, "Content is Required"),
  // published: z.boolean().optional(),
  // status: z.string().optional(),
});

type AddJobDescriptionFormValues = z.infer<typeof addJobSchema>;

const CreateJobRoute = () => {
  const router = useRouter();
  const params = useParams() as { companyId: string };
  const companyId = params.companyId;
  const { permissions } = usePermissions();

  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);

  const methods = useForm<AddJobDescriptionFormValues>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
    
      department: "",
      location: "",
      experience: "",
      salaryRange: "",

      description: "",
      content: "",
    },
  });
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  console.log(session, "sesdsion");
  // let companyId = session?.user?.companyId ? session?.user?.companyId : ""

  const { handleSubmit, reset, control } = methods;

  // const jobId = useMemo(() => {
  //   const idFromParams = params?.id as string;
  //   const uidFromParams = params?.uid as string;
  //   if (idFromParams) return idFromParams;
  //   if (uidFromParams) return uidFromParams;
  //   if (pathname?.includes("create-application")) {
  //     if (typeof window !== "undefined") {
  //       return searchParams?.get("applicationId");
  //     }
  //   }
  //   return null;
  // }, [params?.id, params?.uid, pathname, searchParams]);

  const onSubmit: SubmitHandler<AddJobDescriptionFormValues> = async (data) => {
    try {
      setIsClicked(true);

      // Function to remove HTML tags from rich text fields

      const payload = { ...data, content: data.content, companyId };
      const response = await apiClient.post(
        `/job?companyId=${companyId}`,
        payload
      );
      console.log(response.data, "afh");
      toast.success(response.data.message || "Job added successfully!");
      router.push(`/companies/${companyId}?tab=job-descriptions`);

      // onAdd(response.data.job);
      setIsOpen(false);
      reset();
    } catch (error: any) {
      // toast.error(error.response?.data?.message || error.message);
      console.log(error.response?.data?.message || error.message, "data error");
    } finally {
      setIsClicked(false);
    }
  };

  // fetch job descrioptions
  useEffect(() => {
    if (!companyId) return; // Only fetch if companyId exists

    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get(
          `/department/filter?companyId=${companyId}`
        );
        console.log(res, "res of des");

        setDepartments(res.data.data || []);
        // Optionally pre-select department from `data.department`:
      } catch (error) {
        toast.error("Failed to fetch departments");
      }
    };
    console.log(departments, "departtments in DD ");

    fetchDepartments();
  }, [companyId]);
  return (
    <>
      <DynamicBreadcrumb
        links={[
           { label: "Jobs", href: `/companies/${companyId}?tab=job-description` },
          { label: "Create Job Description" },
        ]}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5"
        >
          <h2 className="text-xl font-bold text-text">New Job Details</h2>
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            {/* <InputField label="Company ID" name="companyId" placeholder="Enter Company ID" /> */}
            {/* <InputField
              label="Job Title"
              name="title"
              placeholder="Enter Job Title"
              
              
            /> */}
            <TextareaField
              // formItemClassName="sm:col-span-2"
              label="Description Title"
              name={"description"}
              placeholder={"Enter Your Description"}
            />
            {/* <InputField
            label="Department"
            name="department"
            placeholder="Enter Department"
          />
           */}
            <FormField
              control={control}
              name="department"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-fontPrimary">
                    Department <span className="text-red-500 ml-1">*</span>
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
              options={employmentOptions.map((v) => ({
                label: v.split("_").join(" "),
                value: v,
              }))}
            />
            {/* <InputField
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
          /> */}
            {/* <TextareaField
              formItemClassName="sm:col-span-2"
              label="Description"
              name={"description"}
              placeholder={"Enter Your Description"}
            /> */}

            <div className="sm:col-span-2 text-text font-medium text-sm">
              <h1 className="mb-2">
                Content <span className="text-red-500 ml-1">*</span>
              </h1>
              <CustomEditorWrapper control={methods.control} name="content" />
            </div>

            {/* <CustomEditor control={methods.control} name="content" /> */}

            {hasPermission(permissions, "add_job") && (
                         <Button
              type="submit"
              className="sm:col-span-2 w-fit justify-self-end"
              disabled={isClicked}
            >
              {isClicked ? "Adding..." : "Add Job"}
            </Button>
                        )}

            
          </section>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateJobRoute;
