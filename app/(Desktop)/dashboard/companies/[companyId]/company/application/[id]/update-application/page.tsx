// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   useParams,
//   usePathname,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { z } from "zod";
// import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
// import Button from "@/components/Others/Button";
// import InputField from "@/components/Form_Fields/InputField";
// import apiClient from "@/lib/axiosInterceptor";
// import {
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
//   FormField,
// } from "@/components/ui/form";
// import { Combobox } from "@/components/Others/ComoboboxDemo";
// import { UploadCloud } from "lucide-react";
// import { BASE_URL } from "@/config";

// const EditApplicationSchema = z.object({
//   jobId: z.string().min(1, "Job ID is required."),
//   companyId: z.string().min(1, "Company ID is required."),
//   candidateName: z.string().min(1, "Candidate Name is required."),
//   email: z.string().email("Invalid email address."),
//   phone: z.string().min(10, "Phone number must be at least 10 digits."),
//   currentCTC: z.string().optional(),
//   expectedCTC: z.string().optional(),
//   noticePeriod: z.string().optional(),
//   status: z.string().optional(),
//   source: z.string().optional(),
//   resume: z.any().optional(),
//   skills: z.array(z.string()).optional(),
//   experience: z
//     .array(
//       z.object({
//         role: z.string().optional(),
//         years: z.string().optional(),
//         company: z.string().optional(),
//       })
//     )
//     .optional(),
// });

// type EditApplicationFormValues = z.infer<typeof EditApplicationSchema>;

// const UpdateApplicationRoute = () => {
//   const router = useRouter();
//   const params = useParams();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const { data: session } = useSession();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [applicationData, setApplicationData] = useState<any>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [description, setDescription] = useState<
//     { id: string; title: string }[]
//   >([]);

//   const companyId = params?.companyId as string;
//   const applicationId = (params?.id as string) || (params?.uid as string);
//   const allStatus = ["applied",]

//   const methods = useForm<EditApplicationFormValues>({
//     resolver: zodResolver(EditApplicationSchema),
//     defaultValues: {
//       jobId: "",
//       candidateName: "",
//       email: "",
//       phone: "",
//       currentCTC: "",
//       expectedCTC: "",
//       noticePeriod: "",
//       status: "",
//       source: "",
//       resume: undefined,
//       skills: [],
//       experience: [],
//     },
//   });
//   const { handleSubmit, setValue, reset, control, watch } = methods;

//    // Field array for dynamic experience fields
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "experience",
//   });

//   console.log("Component state:", {
//     applicationId,
//     companyId,
//     isLoading,
//     applicationData,
//     formValues: methods.watch(),
//   });

//   // Fetch jobs for dropdown
//   useEffect(() => {
//     if (!companyId) return;

//     const fetchDescription = async () => {
//       try {
//         const res = await apiClient.get(`/job/filter?companyId=${companyId}`);
//         setDescription(res.data.data || []);
//       } catch (error) {
//         toast.error("Failed to fetch jobs");
//       }
//     };

//     fetchDescription();
//   }, [companyId]);

//   // Fetch application data
//   useEffect(() => {
//     if (!applicationId || !companyId) return;

//     const fetchApplication = async () => {
//       try {
//         setIsLoading(true);
//         const response = await apiClient.get(`/application/${applicationId}`);
//         const fetchedApplication =
//           response.data?.application || response.data?.data || response.data;

//         console.log("Full API Response:", response.data);
//         console.log("Extracted application data:", fetchedApplication);

//         if (fetchedApplication) {
//           setApplicationData(fetchedApplication);

//           // Populate form with fetched data
//           const formData = {
//             jobId: fetchedApplication.jobId || "",
//             companyId: fetchedApplication.companyId || companyId,
//             candidateName: fetchedApplication.candidateName || "",
//             email: fetchedApplication.email || "",
//             phone: fetchedApplication.phone || "",
//             currentCTC: fetchedApplication.currentCTC || "",
//             expectedCTC: fetchApplication.expectedCTC || "",
//             skills: fetchApplication.skills || "",
//             noticePeriod: fetchedApplication.noticePeriod || "",
//             status: fetchedApplication.status || "",
//             source: fetchedApplication.source || "",
//           };

//           console.log("Populating form with:", formData);
//           reset(formData);

//           // Set preview URL if resume exists
//           if (fetchedApplication.resumeUrl) {
//             // const fullUrl = fetchedApplication.resumeUrl.startsWith("http")
//             //   ? fetchedApplication.resumeUrl
//             //   : `${BASE_URL}${fetchedApplication.resumeUrl}`;
//             // setPreviewUrl(fullUrl);
//             // console.log("Resume preview URL:", fullUrl);
//             setPreviewUrl(fetchedApplication.resumeUrl);
//           }
//         } else {
//           toast.error("Application data not found in response");
//         }
//       } catch (error: any) {
//         toast.error("Failed to fetch application data.");
//         console.error("Fetch application error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchApplication();
//   }, [applicationId, companyId, reset]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > 1024 * 1024) {
//         toast.error("File size exceeds 1MB limit.");
//         setSelectedFile(null);
//         e.target.value = "";
//         return;
//       }
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setValue("resume", file);
//     }
//   };

//   const onSubmit: SubmitHandler<EditApplicationFormValues> = async (
//     formData
//   ) => {
//     try {
//       console.log("Submitting form data:", formData);
//       setIsSubmitting(true);
//       const payload = new FormData();

//       payload.append("jobId", formData.jobId);
//       payload.append("companyId", formData.companyId || companyId);
//       payload.append("candidateName", formData.candidateName);
//       payload.append("email", formData.email);
//       payload.append("phone", formData.phone);

//       if (formData.currentCTC)
//         payload.append("currentCTC", formData.currentCTC);
//       if (formData.noticePeriod)
//         payload.append("noticePeriod", formData.noticePeriod);
//       if (formData.status) payload.append("status", formData.status);
//       if (formData.source) payload.append("source", formData.source);
//       if (selectedFile) payload.append("resume", selectedFile);

//       console.log("Sending PUT request to:", `/application/${applicationId}`);

//       const response = await apiClient.put(
//         `/application/${applicationId}`,
//         payload,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       console.log("Update response:", response.data);
//       toast.success(
//         response.data.message || "Application updated successfully!"
//       );

//       // Navigate back to applications list
//       router.push(`/dashboard/companies/${companyId}?tab=application`);
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || error.message || "An error occurred"
//       );
//       console.error("Submit error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const ResumePreviewModal = ({ previewUrl }: { previewUrl: string }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* Small preview thumbnail */}
//       <div
//         className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
//         onClick={() => setIsOpen(true)}
//       >
//         {previewUrl.toLowerCase().endsWith(".pdf") ? (
//           <div className="w-36 h-32 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
//             <iframe
//               src={previewUrl}
//               className="w-full h-full pointer-events-none"
//               title="Resume Preview"
//             />
//           </div>
//         ) : (
//           <img
//             src={previewUrl}
//             alt="Resume Preview"
//             className="object-contain rounded-md w-36 h-32 border border-gray-200"
//           />
//         )}
//       </div>

//       {/* Fullscreen Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold z-10"
//             >
//               &times;
//             </button>

//             {previewUrl.toLowerCase().endsWith(".pdf") ? (
//               <iframe
//                 src={previewUrl}
//                 className="w-full h-[90vh]"
//                 title="Full Resume"
//               />
//             ) : (
//               <img
//                 src={previewUrl}
//                 alt="Full Resume"
//                 className="w-full h-auto object-contain"
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

//   return (
//     <>
//       <DynamicBreadcrumb
//         links={[
//           {
//             label: "Applications",
//             href: `/dashboard/companies/${companyId}?tab=application`,
//           },
//           { label: "Edit Application" },
//         ]}
//       />

//       <FormProvider {...methods}>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5"
//         >
//           {/* Application Details Section */}
//           <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
//             <h2 className="text-xl font-bold text-text">
//               Edit Application Details
//             </h2>

//             {isLoading ? (
//               <div className="text-center py-4">
//                 Loading application data...
//               </div>
//             ) : (
//               <>
//                 <div className="gap-5">
//                   <div className="grid sm:grid-cols-2 gap-5">
//                     <FormField
//                       control={control}
//                       name="jobId"
//                       render={({ field }) => (
//                         <FormItem className="sm:col-span-1">
//                           <FormLabel className="text-fontPrimary">
//                             Job Position
//                           </FormLabel>
//                           <FormControl>
//                             <Combobox
//                               placeholder="Select Job"
//                               options={description.map((dep) => ({
//                                 value: dep.id,
//                                 label: dep.title,
//                               }))}
//                               value={field.value}
//                               onSelect={field.onChange}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <InputField
//                       label="Candidate Name"
//                       name="candidateName"
//                       placeholder="Enter candidate name"
//                     />
//                   </div>

//                   <div className="grid sm:grid-cols-2 gap-5 mt-4">
//                     <InputField
//                       label="Email"
//                       name="email"
//                       placeholder="Enter email"
//                     />
//                     <InputField
//                       label="Phone"
//                       name="phone"
//                       placeholder="Enter phone number"
//                     />
//                   </div>

//                   <div className="grid sm:grid-cols-2 gap-5 mt-4">
//                     <InputField
//                       label="Current CTC"
//                       name="currentCTC"
//                       placeholder="Enter current CTC"
//                     />
//                     <InputField
//                       label="Notice Period"
//                       name="noticePeriod"
//                       placeholder="Enter notice period"
//                     />
//                   </div>

//                   <div className="grid sm:grid-cols-2 gap-5 mt-4">
//                     <InputField
//                       label="Status"
//                       name="status"
//                       placeholder="Enter status"
//                     />
//                     <InputField
//                       label="Source"
//                       name="source"
//                       placeholder="Enter source"
//                     />
//                   </div>

//                   {/* Resume Upload with Preview */}
//                   <FormItem className="gap-2 grid mt-4">
//                     <FormLabel className="text-fontPrimary">
//                       Resume / Attachment
//                     </FormLabel>
//                     <FormControl>
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 flex-1"
//                           onClick={() =>
//                             document
//                               .getElementById("application-resume-upload")
//                               ?.click()
//                           }
//                         >
//                           <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
//                           <p className="text-sm text-gray-600">
//                             Click to upload or drag & drop
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             PDF/JPEG (max. 1MB)
//                           </p>
//                           <input
//                             id="application-resume-upload"
//                             type="file"
//                             accept="image/*,application/pdf"
//                             className="hidden"
//                             onChange={handleFileChange}
//                           />
//                           {selectedFile && (
//                             <p className="mt-2 text-sm text-green-600">
//                               {selectedFile.name} selected
//                             </p>
//                           )}
//                         </div>

//                         {/* Preview Section */}
//                       {/* Preview Section with Full Modal View */}
// {previewUrl && (
//   <ResumePreviewModal previewUrl={previewUrl} />
// )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>

//                   {/* Hidden field for companyId */}
//                   <input type="hidden" {...methods.register("companyId")} />

//                   <Button
//                     type="submit"
//                     disabled={isSubmitting || isLoading}
//                     className="w-fit justify-self-end sm:col-span-2 lg:col-span-3 mt-4"
//                   >
//                     {isSubmitting ? "Updating..." : "Update Application"}
//                   </Button>
//                 </div>
//               </>
//             )}
//           </section>
//         </form>
//       </FormProvider>
//     </>
//   );
// };

// export default UpdateApplicationRoute;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import InputField from "@/components/Form_Fields/InputField";
import apiClient from "@/lib/axiosInterceptor";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import { Plus, UploadCloud } from "lucide-react";
import { BASE_URL } from "@/config";
import { useFieldArray } from "react-hook-form";
import SelectField from "@/components/Form_Fields/SelectField";

const statusOptions = [
  "APPLIED",
  "SHORTLIST",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
] as const;

const EditApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required."),
  companyId: z.string().min(1, "Company ID is required."),
  candidateName: z.string().min(1, "Candidate Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  currentCTC: z.string().optional(),
  expectedCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  status: z.enum(statusOptions),
  source: z.string().optional(),
  resume: z.any().optional(),
  skills: z.array(z.string()).optional(),
  experience: z
    .array(
      z.object({
        role: z.string(),
        years: z.union([z.string(), z.number()]),
        company: z.string(),
      })
    )
    .optional(),
});

type EditApplicationFormValues = z.infer<typeof EditApplicationSchema>;

const UpdateApplicationRoute = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<
    { id: string; title: string }[]
  >([]);

  const companyId = params?.companyId as string;
  const applicationId = (params?.id as string) || (params?.uid as string);

  const methods = useForm<EditApplicationFormValues>({
    resolver: zodResolver(EditApplicationSchema),
    defaultValues: {
      jobId: "",
      companyId: "",
      candidateName: "",
      email: "",
      phone: "",
      currentCTC: "",
      expectedCTC: "",
      noticePeriod: "",
      status: "APPLIED",
      source: "",
      resume: undefined,
      skills: [],
      experience: [],
    },
  });

  const { handleSubmit, reset, control, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  console.log("Component state:", {
    applicationId,
    companyId,
    isLoading,
    applicationData,
    formValues: methods.watch(),
  });

  // Fetch jobs for dropdown
  useEffect(() => {
    if (!companyId) return;

    const fetchDescription = async () => {
      try {
        const res = await apiClient.get(`/job/filter?companyId=${companyId}`);
        setDescription(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch jobs");
      }
    };

    fetchDescription();
  }, [companyId]);

  // Fetch application data
  useEffect(() => {
    if (!applicationId || !companyId) return;

    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/application/${applicationId}`);
        const fetchedApplication =
          response.data?.application || response.data?.data || response.data;

        console.log("Full API Response:", response.data);
        console.log("Extracted application data:", fetchedApplication);

        if (fetchedApplication) {
          setApplicationData(fetchedApplication);

          // Populate form with fetched data
          const formData = {
            jobId: fetchedApplication.jobId || "",
            companyId: fetchedApplication.companyId || companyId,
            candidateName: fetchedApplication.candidateName || "",
            email: fetchedApplication.email || "",
            phone: fetchedApplication.phone || "",
            currentCTC: fetchedApplication.currentCTC || "",
            expectedCTC: fetchedApplication.expectedCTC || "",
            noticePeriod: fetchedApplication.noticePeriod || "",
            status: fetchedApplication.status || "APPLIED",
            skills: fetchedApplication.skills || "",
            experience: fetchedApplication.experience || "",
            source: fetchedApplication.source || "",
          };

          console.log("Populating form with:", formData);
          reset(formData);

          // Set preview URL if resume exists
          if (fetchedApplication.resumeUrl) {
            const fullUrl = fetchedApplication.resumeUrl.startsWith("http")
              ? fetchedApplication.resumeUrl
              : `${BASE_URL}${fetchedApplication.resumeUrl}`;
            setPreviewUrl(fullUrl);
            console.log("Resume preview URL:", fullUrl);
          }
        } else {
          toast.error("Application data not found in response");
        }
      } catch (error: any) {
        toast.error("Failed to fetch application data.");
        console.error("Fetch application error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, companyId, reset]);

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
      setPreviewUrl(URL.createObjectURL(file));
      setValue("resume", file);
    }
  };

  const onSubmit: SubmitHandler<EditApplicationFormValues> = async (
    formData
  ) => {
    try {
      console.log("Submitting form data:", formData);
      setIsSubmitting(true);
      const payload = new FormData();

      payload.append("jobId", formData.jobId);
      payload.append("companyId", formData.companyId || companyId);
      payload.append("candidateName", formData.candidateName);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);

      if (formData.currentCTC)
        payload.append("currentCTC", formData.currentCTC);
      if (formData.noticePeriod)
        payload.append("noticePeriod", formData.noticePeriod);
      if (formData.status) payload.append("status", formData.status);
      if (formData.source) payload.append("source", formData.source);
      if (selectedFile) payload.append("resume", selectedFile);

      console.log("Sending PUT request to:", `/application/${applicationId}`);

      const response = await apiClient.put(
        `/application/${applicationId}`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Update response:", response.data);
      toast.success(
        response.data.message || "Application updated successfully!"
      );

      // Navigate back to applications list
      router.push(`/dashboard/companies/${companyId}?tab=application`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const statusSelect = statusOptions.map((v) => ({
    label: v,
    value: v,
  }));

  const ResumePreviewModal = ({ previewUrl }: { previewUrl: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {/* Small preview thumbnail */}
        <div
          className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          {previewUrl.toLowerCase().endsWith(".pdf") ? (
            <div className="w-36 h-32 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
              <iframe
                src={previewUrl}
                className="w-full h-full pointer-events-none"
                title="Resume Preview"
              />
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Resume Preview"
              className="object-contain rounded-md w-36 h-32 border border-gray-200"
            />
          )}
        </div>

        {/* Fullscreen Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold z-10"
              >
                &times;
              </button>

              {previewUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[90vh]"
                  title="Full Resume"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Full Resume"
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <DynamicBreadcrumb
        links={[
          {
            label: "Applications",
            href: `/dashboard/companies/${companyId}?tab=application`,
          },
          { label: "Edit Application" },
        ]}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5"
        >
          {/* Application Details Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <h2 className="text-xl font-bold text-text">
              Edit Application Details
            </h2>

            {isLoading ? (
              <div className="text-center py-4">
                Loading application data...
              </div>
            ) : (
              <>
                <div className="gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      control={control}
                      name="jobId"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel className="text-fontPrimary">
                            Job Position
                          </FormLabel>
                          <FormControl>
                            <Combobox
                              placeholder="Select Job"
                              options={description.map((dep) => ({
                                value: dep.id,
                                label: dep.title,
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
                      label="Candidate Name"
                      name="candidateName"
                      placeholder="Enter candidate name"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <InputField
                      label="Email"
                      name="email"
                      placeholder="Enter email"
                    />
                    <InputField
                      label="Phone"
                      name="phone"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <InputField
                      label="Current CTC"
                      name="currentCTC"
                      placeholder="Enter current CTC"
                    />
                    <InputField
                      label="Expected CTC"
                      name="expectedCTC"
                      placeholder="Enter expected CTC"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <InputField
                      label="Notice Period"
                      name="noticePeriod"
                      placeholder="Enter notice period"
                    />
                    {/* <InputField label="Status" name="status" placeholder="Enter status" /> */}
                    <SelectField
                      label="Status"
                      name="status"
                      placeholder="Select Type"
                      options={statusSelect}
                    />
                  </div>

                  <div className="grid sm:grid-cols-1 gap-5 mt-4">
                    <InputField
                      label="Source"
                      name="source"
                      placeholder="Enter source"
                    />
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <FormLabel className="text-fontPrimary">
                      Skills (comma separated)
                    </FormLabel>

                    <input
                      type="text"
                      defaultValue={methods.watch("skills")?.join(", ") || ""}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                      placeholder="e.g. React, Node.js, Tailwind"
                      onChange={(e) => {
                        const skillsArray = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setValue("skills", skillsArray);
                      }}
                    />
                  </div>

                  {/* Experience */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <FormLabel className="text-fontPrimary text-base">
                        Experience
                      </FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          append({ role: "", years: "", company: "" })
                        }
                      >
                        + Add Experience
                      </Button>
                    </div>

                    {fields.length > 0 ? (
                      fields.map((item, index) => (
                        <div key={item.id} className="space-y-2 mb-3">
                          <div className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
                            <div className="col-span-4">
                              <InputField
                                label="Company"
                                name={`experience.${index}.company`}
                                placeholder="Company name"
                              />
                            </div>
                            <div className="col-span-4">
                              <InputField
                                label="Role"
                                name={`experience.${index}.role`}
                                placeholder="Your role"
                              />
                            </div>
                            <div className="col-span-3">
                              <InputField
                                label="Years"
                                name={`experience.${index}.years`}
                                placeholder="Years"
                              />
                            </div>
                            {fields.length > 1 && (
                              <div className="col-span-1 flex items-end">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => remove(index)}
                                >
                                  ×
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 mt-2">
                        No experience added yet.
                      </p>
                    )}
                  </div>

                  {/* Resume Upload with Preview */}
                  <FormItem className="gap-2 grid mt-4">
                    <FormLabel className="text-fontPrimary">
                      Resume / Attachment
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div
                          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 flex-1"
                          onClick={() =>
                            document
                              .getElementById("application-resume-upload")
                              ?.click()
                          }
                        >
                          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF/JPEG (max. 1MB)
                          </p>
                          <input
                            id="application-resume-upload"
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {selectedFile && (
                            <p className="mt-2 text-sm text-green-600">
                              {selectedFile.name} selected
                            </p>
                          )}
                        </div>

                        {/* Preview Section */}
                        {/* Preview Section with Full Modal View */}
                        {previewUrl && (
                          <ResumePreviewModal previewUrl={previewUrl} />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  {/* Hidden field for companyId */}
                  <input type="hidden" {...methods.register("companyId")} />

                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-fit justify-self-end sm:col-span-2 lg:col-span-3 mt-4"
                  >
                    {isSubmitting ? "Updating..." : "Update Application"}
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

export default UpdateApplicationRoute;
