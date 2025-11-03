// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { z } from "zod";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
// import Button from "@/components/Others/Button";
// import InputField from "@/components/Form_Fields/InputField";
// import apiClient from "@/lib/axiosInterceptor";
// import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
// import { Combobox } from "@/components/Others/ComoboboxDemo";
// import { Plus, UploadCloud } from "lucide-react";

// const addApplicationSchema = z.object({
//   jobId: z.string().min(1, "Job is required"),
//   companyId: z.string().optional(),
//   candidateName: z.string().min(1, "Candidate Name is required."),
//   email: z.string().email("Invalid email."),
//   phone: z.string().min(10, "Phone must be at least 10 digits."),
//   resume: z.instanceof(File).optional(), 
//   experiences: z.array(z.object({
//     company: z.string().min(1, "Company required"),
//     role: z.string().min(1, "Role required"),
//     years: z.string().min(1, "Years required")
//   })).min(1, "At least one experience required"),
//   skills: z.string().optional(),
//   currentCTC: z.string().optional(),
//   expectedCTC: z.string().optional(),
//   noticePeriod: z.string().optional(),
//   status: z.string().optional(),
//   source: z.string().optional(),
// //   Notes: z.string().optional(),
// //   History: z.string().optional(),
// });

// type AddApplicationFormValues = z.infer<typeof addApplicationSchema>;

// const CreateApplicationRoute = () => {
//   const router = useRouter();
//   const params = useParams();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const { data: session } = useSession();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [applicationData, setApplicationData] = useState<any>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [description, setDescription] = useState<{ id: string; title: string }[]>([]);
//   const [experiences, setExperiences] = useState([{ company: "", role: "", years: "" }]);

//   const companyId = params?.companyId as string;

//   const methods = useForm<AddApplicationFormValues>({
//     resolver: zodResolver(addApplicationSchema),
//     defaultValues: {
//       jobId: "",
//       candidateName: "",
//       email: "",
//       phone: "",
//       experiences: [{ company: "", role: "", years: "" }],
//       skills: "",
//       currentCTC: "",
//       expectedCTC: "",
//       noticePeriod: "",
//       status: "",
//       source: "",
//     //   Notes: "",
//     //   History: ""
//     },
//   });

//   const { handleSubmit, reset, control, setValue } = methods;

//   const applicationId = useMemo(() => {
//     const idFromParams = params?.id as string;
//     const uidFromParams = params?.uid as string;

//     if (idFromParams) return idFromParams;
//     if (uidFromParams) return uidFromParams;
//     if (pathname?.includes("create-application")) {
//       if (typeof window !== "undefined") {
//         return searchParams?.get("applicationId");
//       }
//     }
//     return null;
//   }, [params?.id, params?.uid, pathname, searchParams]);

//   console.log(applicationId, "applicationId");

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

//   // Fetch application data if applicationId exists
//   useEffect(() => {
//     if (applicationId && !applicationData) {
//       const fetchApplication = async () => {
//         try {
//           setIsLoading(true);
//           const response = await apiClient.get(`/application/${applicationId}`);
//           const fetchedApplication = response.data?.application || response.data?.data || response.data;

//           console.log("Full API Response:", response.data);
//           console.log("Extracted application data:", fetchedApplication);

//           if (fetchedApplication) {
//             setApplicationData(fetchedApplication);
//             console.log(fetchedApplication, "fetchedApplication");

//             reset({
//               jobId: fetchedApplication.jobId || "",
//               candidateName: fetchedApplication.candidateName || "",
//               email: fetchedApplication.email || "",
//               phone: fetchedApplication.phone || "",
//               experiences: fetchedApplication.experiences || [{ company: "", role: "", years: "" }],
//               skills: fetchedApplication.skills || "",
//               currentCTC: fetchedApplication.currentCTC || "",
//               expectedCTC: fetchedApplication.expectedCTC || "",
//               noticePeriod: fetchedApplication.noticePeriod || "",
//               status: fetchedApplication.status || "",
//               source: fetchedApplication.source || "",
//             //   Notes: fetchedApplication.Notes || "",
//             //   History: fetchedApplication.History || "",
//             });

//             setExperiences(fetchedApplication.experiences || [{ company: "", role: "", years: "" }]);
//           } else {
//             toast.error("Application data not found in response");
//           }
//         } catch (error: any) {
//           toast.error("Failed to fetch application data.");
//           console.error("Fetch application error:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchApplication();
//     } else if (applicationId && applicationData) {
//       console.log("Using cached application data:", applicationData);
//     } else {
//       setApplicationData(null);
//       setExperiences([{ company: "", role: "", years: "" }]);
//       reset({
//         jobId: "",
//         candidateName: "",
//         email: "",
//         phone: "",
//         experiences: [{ company: "", role: "", years: "" }],
//       });
//     }
//   }, [applicationId, reset]);

//   const addExperience = () => {
//     setExperiences([...experiences, { company: "", role: "", years: "" }]);
//   };

//   const removeExperience = (index: number) => {
//     if (experiences.length > 1) {
//       setExperiences(experiences.filter((_, i) => i !== index));
//     }
//   };

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
//       setValue("resume", file);
//     }
//   };

//   const onSubmit: SubmitHandler<AddApplicationFormValues> = async (data) => {
//     if (!selectedFile && !applicationId) {
//       toast.error("Please upload your resume.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();

//       formData.append("candidateName", data.candidateName);
//       formData.append("email", data.email);
//       formData.append("phone", data.phone);
//       formData.append("jobId", data.jobId);
//       formData.append("companyId", companyId);
//        formData.append("currentCTC", data.currentCTC);
      
      
//       if (selectedFile) {
//         formData.append("resume", selectedFile);
//       }

//       if (data.skills) {
//         data.skills.split(",").forEach((skill) => {
//           formData.append("skills[]", skill.trim());
//         });
//       }

//       data.experiences.forEach((exp, index) => {
//         formData.append(`experience[${index}][company]`, exp.company);
//         formData.append(`experience[${index}][role]`, exp.role);
//         formData.append(`experience[${index}][years]`, exp.years.toString());
//       });
     

//       const response = await apiClient.post("/application/submit", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success(response.data.message || "Application created successfully!");
//       const newApplicationId = response.data.data.id;
//       const createdApplication = response.data.data;
//       setApplicationData(createdApplication);

//       reset({
//         jobId: createdApplication.jobId || "",
//         candidateName: createdApplication.candidateName,
//         email: createdApplication.email || "",
//         phone: createdApplication.phone || "",
//         experiences: createdApplication.experiences || data.experiences,
//         skills: createdApplication.skills || data.skills,
//               currentCTC: createdApplication.currentCTC || data.currentCTC,
//               expectedCTC: createdApplication.expectedCTC || data.expectedCTC,
//               noticePeriod: createdApplication.noticePeriod || data.noticePeriod,
//             //   status: createdApplication.status || data.status,
//               source: createdApplication.source || data.source,

//       });

//       const searchParams = new URLSearchParams(window.location.search);
//       searchParams.set('applicationId', newApplicationId);
//       router.replace(`/dashboard/companies/${companyId}/company/application/create-application?${searchParams.toString()}`, { scroll: false });
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || error.message || "An error occurred");
//       console.error("Submit error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <DynamicBreadcrumb
//         links={[
//           { label: "Applications", href: `/dashboard/companies/${companyId}?tab=application` },
//           { label: applicationId ? "Edit Application" : "Create Application" }
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
//               {applicationId ? "Edit Application Details" : "New Application Details"}
//             </h2>
            
//             {isLoading ? (
//               <div className="text-center py-4">Loading application data...</div>
//             ) : (
//               <>
//                 <div className="gap-5">
//                   <div className="grid sm:grid-cols-2 gap-5">
//                     <FormField
//                       control={control}
//                       name="jobId"
//                       render={({ field }) => (
//                         <FormItem className="sm:col-span-1">
//                           <FormLabel className="text-fontPrimary">Job Position</FormLabel>
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
//                     <InputField label="Email" name="email" placeholder="Enter email" />
//                     <InputField label="Phone" name="phone" placeholder="Enter phone number" />
//                   </div>

//                   {/* Resume Upload */}
//                   <FormItem className="gap-2 grid mt-4">
//                     <FormLabel className="text-text text-sm">Resume / Attachment</FormLabel>
//                     <FormControl>
//                       <div
//                         className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
//                         onClick={() =>
//                           document.getElementById("application-image-upload")?.click()
//                         }
//                       >
//                         <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-600">
//                           Click to upload or drag & drop
//                         </p>
//                         <p className="text-xs text-gray-500">JPEG / PDF (max. 1MB)</p>
//                         <input
//                           id="application-image-upload"
//                           type="file"
//                           accept="image/*,application/pdf"
//                           className="hidden"
//                           onChange={handleFileChange}
//                         />
//                         {selectedFile && (
//                           <p className="mt-2 text-sm text-green-600">
//                             {selectedFile.name} selected
//                           </p>
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>

//                   {/* Experience Section */}
//                   <div className="mt-4 space-y-4">
//                     <div className="flex justify-between items-center">
//                       <FormLabel className="text-fontPrimary text-base">Experience</FormLabel>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={addExperience}
//                       >
//                         <Plus className="h-4 w-4 mr-1" /> Add Experience
//                       </Button>
//                     </div>

//                     {experiences.map((_, index) => (
//                       <div key={index} className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
//                         <div className="col-span-4">
//                           <InputField
//                             label="Company"
//                             name={`experiences.${index}.company`}
//                             placeholder="Company name"
//                           />
//                         </div>
//                         <div className="col-span-4">
//                           <InputField
//                             label="Role"
//                             name={`experiences.${index}.role`}
//                             placeholder="Your role"
//                           />
//                         </div>
//                         <div className="col-span-3">
//                           <InputField
//                             label="Years"
//                             name={`experiences.${index}.years`}
//                             placeholder="Years"
//                           />
//                         </div>
//                         {experiences.length > 1 && (
//                           <div className="col-span-1 flex items-end">
//                             <Button
//                               type="button"
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => removeExperience(index)}
//                             >
//                               ×
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={isSubmitting || isLoading}
//                     className="w-fit justify-self-end sm:col-span-2 lg:col-span-3 mt-4"
//                   >
//                     {isSubmitting 
//                       ? (applicationId ? "Updating..." : "Creating...") 
//                       : (applicationId ? "Update Application" : "Create Application")
//                     }
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

// export default CreateApplicationRoute;


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import InputField from "@/components/Form_Fields/InputField";
import apiClient from "@/lib/axiosInterceptor";
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import { Plus, UploadCloud } from "lucide-react";
import TextareaField from "@/components/Form_Fields/TextareaField";

const addApplicationSchema = z.object({
  jobId: z.string().min(1, "Job is required"),
  companyId: z.string().optional(),
  candidateName: z.string().min(1, "Candidate Name is required."),
  email: z.string().email("Invalid email."),
  phone: z.string().min(10, "Phone must be at least 10 digits."),
  resume: z.instanceof(File).optional(),
  experiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      years: z.string(),
    })
  ).optional(),
  skills: z.string().optional(),
  currentCTC: z.string().optional(),
  expectedCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  // status: z.string().optional(),
  source: z.string().optional(),
});

type AddApplicationFormValues = z.infer<typeof addApplicationSchema>;

const CreateApplicationRoute = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<{ id: string; name: string }[]>([]);
  const [experiences, setExperiences] = useState([{ company: "", role: "", years: "" }]);

  const companyId = params?.companyId as string;

  const methods = useForm<AddApplicationFormValues>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
      jobId: "",
      candidateName: "",
      email: "",
      phone: "",
      experiences: [{ company: "", role: "", years: "" }],
      skills: "",
      currentCTC: "",
      expectedCTC: "",
      noticePeriod: "",
      // status: "",
      source: "",
    },
  });

  const { handleSubmit, reset, control, setValue } = methods;

  const applicationId = useMemo(() => {
    const idFromParams = params?.id as string;
    const uidFromParams = params?.uid as string;
    if (idFromParams) return idFromParams;
    if (uidFromParams) return uidFromParams;
    if (pathname?.includes("create-application")) {
      if (typeof window !== "undefined") {
        return searchParams?.get("applicationId");
      }
    }
    return null;
  }, [params?.id, params?.uid, pathname, searchParams]);

  // Fetch jobs for dropdown
  useEffect(() => {
    if (!companyId) return;
    const fetchDescription = async () => {
      try {
        const res = await apiClient.get(`/job/filter?companyId=${companyId}`);
        setDescription(res.data.data || []);
      } catch {
        toast.error("Failed to fetch jobs");
      }
    };
    fetchDescription();
  }, [companyId]);
  console.log(description,"filter desc")

  const addExperience = () => {
    setExperiences([...experiences, { company: "", role: "", years: "" }]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

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
      setValue("resume", file);
    }
  };

  const onSubmit: SubmitHandler<AddApplicationFormValues> = async (data) => {
    if (!selectedFile && !applicationId) {
      toast.error("Please upload your resume.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();



      formData.append("candidateName", data.candidateName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("jobId", data.jobId);
      // formData.append("companyId", companyId);

      if (data.currentCTC) formData.append("currentCTC", data.currentCTC);
      if (data.expectedCTC) formData.append("expectedCTC", data.expectedCTC);
      if (data.noticePeriod) formData.append("noticePeriod", data.noticePeriod);
      // if (data.status) formData.append("status", data.status);
      if (data.source) formData.append("source", data.source);
      if (data.skills) formData.append("skills", data.skills);

      if (selectedFile) formData.append("resume", selectedFile);

      data?.experiences?.forEach((exp, index) => {
        formData.append(`experience[${index}][company]`, exp.company);
        formData.append(`experience[${index}][role]`, exp.role);
        formData.append(`experience[${index}][years]`, exp.years);
      });

      const response = await apiClient.post(`/application/submit?companyId=${companyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Application created successfully!");

      router.push(`/dashboard/companies/${companyId}?tab=application`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Applications", href: `/dashboard/companies/${companyId}?tab=application` },
          { label: applicationId ? "Edit Application" : "Create Application" },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5">
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <h2 className="text-xl font-bold text-text">
              {applicationId ? "Edit Application Details" : "New Application Details"}
            </h2>

            {/* Job & Candidate Info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField
                control={control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Position</FormLabel>
                    <FormControl>
                      <Combobox
                        placeholder="Select Job"
                        options={description.map((dep) => ({
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

              <InputField label="Candidate Name" name="candidateName" placeholder="Enter candidate name" />
            </div>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="Email" name="email" placeholder="Enter email" />
              <InputField label="Phone" name="phone" placeholder="Enter phone number" />
            </div>

            {/* Resume Upload */}
            <FormItem className="gap-2 grid mt-4">
              <FormLabel className="text-fontPrimary">Resume / Attachment</FormLabel>
              <FormControl>
                
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  onClick={() => document.getElementById("application-image-upload")?.click()}
                >
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-500">PDF / JPEG (max. 1MB)</p>
                  <input
                    id="application-image-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {selectedFile && <p className="mt-2 text-sm text-green-600">{selectedFile.name} selected</p>}
                </div>
              </FormControl>
            </FormItem>

            {/* Experience Section */}
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-fontPrimary text-base">Experience</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-1" /> Add Experience
                </Button>
              </div>

              {experiences.map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
                  <div className="col-span-4">
                    <InputField label="Company" name={`experiences.${index}.company`} placeholder="Company name" />
                  </div>
                  <div className="col-span-4">
                    <InputField label="Role" name={`experiences.${index}.role`} placeholder="Your role" />
                  </div>
                  <div className="col-span-3">
                    <InputField label="Years" name={`experiences.${index}.years`} placeholder="Years" />
                  </div>
                  {experiences.length > 1 && (
                    <div className="col-span-1 flex items-end">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Fields */}
            <div className="grid sm:grid-cols-2 gap-5 mt-4">
              {/* <InputField label="Skills" name="skills" placeholder="Enter skills (comma separated)" /> */}
               <TextareaField
                    
                       label="Skills"
                              name={"skills"}
                              placeholder={"Enter Skills"}
                            />
              <InputField 
              label="Current CTC" name="currentCTC" placeholder="Enter current CTC" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-4">
              <InputField label="Expected CTC" name="expectedCTC" placeholder="Enter expected CTC" />
              <InputField label="Notice Period" name="noticePeriod" placeholder="Enter notice period" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-4">
              {/* <InputField label="Status" name="status" placeholder="Enter status" /> */}
              <InputField label="Source" name="source" placeholder="Enter source" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-fit justify-self-end mt-4"
            >
              {isSubmitting
                ? applicationId
                  ? "Updating..."
                  : "Creating..."
                : applicationId
                ? "Update Application"
                : "Create Application"}
            </Button>
          </section>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateApplicationRoute;
