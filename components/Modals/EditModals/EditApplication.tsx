// "use client";

// import apiClient from "@/lib/axiosInterceptor";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Pencil, Plus, UploadCloud } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import {
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import Button from "@/components/Others/Button";
// import DialogModal from "@/components/Others/DialogModal";
// import InputField from "@/components/Form_Fields/InputField";
// import SelectField from "@/components/Form_Fields/SelectField";
// import { UpdateApplicationProps } from "@/types/companyInterface";
// import { BASE_URL } from "@/config";

// // Define schema with Zod
// const EditApplicationSchema = z.object({
//   jobId: z.string().min(1, "Job ID is required."),
//   companyId: z.string().min(1, "Company ID is required."),
//   candidateName: z.string().min(1, "Candidate Name is required."),
//   email: z.string().email("Invalid email address."),
//   phone: z.string().min(10, "Phone number must be at least 10 digits."),
//   currentCTC: z.string().optional(),
//   noticePeriod: z.string().optional(),
//   status: z.string().optional(),
//   source: z.string().optional(),
//   resumeUrl: z.any().optional(),
// });

// type EditApplicationFormValues = z.infer<typeof EditApplicationSchema>;

// // export interface UpdateApplication {
// //   jobId: string;
// //   companyId: string;
// //   candidateName: string;
// //   email: string;
// //   phone: string;
// //   currentCTC?: string;
// //   noticePeriod?: string;
// //   status?: string;
// //   source?: string;
// //   attachment?: File;
// // }

// // export interface UpdateApplicationProps {
// //   id: number | string;
// //   data: UpdateApplication;
// //   onUpdate: (updated: UpdateApplication) => void;
// // }

// const EditApplication: React.FC<UpdateApplicationProps> = ({ onUpdate, data, id }) => {
//   const [isClicked, setIsClicked] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const methods = useForm<EditApplicationFormValues>({
//     resolver: zodResolver(EditApplicationSchema),
//     defaultValues: {
//       // jobId: "",
//       // companyId: "",
//       candidateName: "",
//       email: "",
//       phone: "",
//       currentCTC: "",
//       noticePeriod: "",
//       status: "",
//       source: "",
//       resumeUrl: undefined,
//     },
//   });

//   const { handleSubmit, setValue, reset } = methods;

//   // Populate form when modal opens or data changes
//   useEffect(() => {
//     if (data && isModalOpen) {
//       setValue("jobId", data.jobId);
//       setValue("companyId", data.companyId);
//       setValue("candidateName", data.candidateName);
//       setValue("email", data.email);
//       setValue("phone", data.phone);
//       setValue("currentCTC", data.currentCTC || "");
//       setValue("noticePeriod", data.noticePeriod || "");
//       setValue("status", data.status || "");
//       setValue("source", data.source || "");
//        if (data.resumeUrl) {
//             const fullUrl = data.resumeUrl.startsWith("http")
//               ? data.resumeUrl
//               : `${BASE_URL}${data.resumeUrl}`;
//             setPreviewUrl(fullUrl);
//           } else {
//             setPreviewUrl(null);
//           }
//           setSelectedFile(null);
//         }
//     }
//   }, [data, isModalOpen, setValue]);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       if (file.size > 1024 * 1024) {
//         toast.error("File size exceeds 1MB limit.");
//         setSelectedFile(null);
//         event.target.value = "";
//         return;
//       }
//       setSelectedFile(file);
//       setValue("resumeUrl", file);
//     }
//   };

//   const onSubmit: SubmitHandler<EditApplicationFormValues> = async (formData) => {
//   try {
//     setIsClicked(true);
//     const payload = new FormData();
//     payload.append("jobId", formData.jobId);
//     payload.append("companyId", formData.companyId);
//     payload.append("candidateName", formData.candidateName);
//     payload.append("email", formData.email);
//     payload.append("phone", formData.phone);
//     if (formData.currentCTC) payload.append("currentCTC", formData.currentCTC);
//     if (formData.noticePeriod) payload.append("noticePeriod", formData.noticePeriod);
//     if (formData.status) payload.append("status", formData.status);
//     if (formData.source) payload.append("source", formData.source);
//     if (selectedFile) payload.append("resumeUrl", selectedFile);

//     const response = await apiClient.put(`/application/${id}`, payload, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     if ((response as any).status === 200 || (response as any).status === 201) {
//       toast.success((response as any).data?.message || "Application updated successfully");
//       onUpdate((response as any).data?.application ?? response.data);
//       setIsModalOpen(false);
//       reset();
//       setSelectedFile(null);
//     } else {
//       toast.error((response as any).data?.message || "Failed to update application");
//     }
//   } catch (error: any) {
//     toast.error(error.response?.data?.message || error.message || "Update failed");
//   } finally {
//     setIsClicked(false);
//   }
// };

//   return (
//   <DialogModal
//       open={isModalOpen}
//       onOpenChange={setIsModalOpen}
//       title="Edit Company"
//       icon={<Pencil />}
//     >
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
//           {/* <InputField label="Job ID" name="jobId" placeholder="Enter Job ID" formItemClassName="sm:col-span-2" />
//           <InputField label="Company ID" name="companyId" placeholder="Enter Company ID" formItemClassName="sm:col-span-2" /> */}
//           <InputField label="Candidate Name" name="candidateName" placeholder="Enter Candidate Name" formItemClassName="sm:col-span-2" />
//           <InputField label="Email" name="email" placeholder="Enter Email" />
//           <InputField label="Phone" name="phone" placeholder="Enter Phone" />
//           <InputField label="Current CTC" name="currentCTC" placeholder="Current CTC" />
//           <InputField label="Notice Period" name="noticePeriod" placeholder="Notice Period" />
//           <InputField label="Status" name="status" placeholder="Status" />
//           <InputField label="Source" name="source" placeholder="Source" />

//           <FormItem className="gap-2 grid sm:col-span-2">
//             <FormLabel className="text-text text-sm">Resume</FormLabel>
//             <FormControl>
//               <div
//                 className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
//                 onClick={() => document.getElementById("application-upload")?.click()}
//               >
//                 <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
//                 <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
//                 <p className="text-xs text-gray-500">PDF/JPEG (max. 1MB)</p>
//                 <input
//                   id="application-upload"
//                   type="file"
//                   accept="application/pdf,image/jpeg"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//                 {selectedFile && (
//                   <p className="mt-2 text-sm text-green-600">{selectedFile.name} selected</p>
//                 )}
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>

//           <Button
//             className="rounded-full justify-self-end mt-4 w-fit sm:col-span-2"
//             type="submit"
//             disabled={isClicked || methods.formState.isSubmitting}
//           >
//             {methods.formState.isSubmitting || isClicked ? "Updating..." : "Update Application"}
//           </Button>
//         </form>
//       </FormProvider>
//     </DialogModal>
//   );
// };

// export default EditApplication;

"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UploadCloud, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Button from "@/components/Others/Button";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import { UpdateApplicationProps } from "@/types/companyInterface";
import { BASE_URL } from "@/config";

const EditApplicationSchema = z.object({
  // jobId: z.string().min(1, "Job ID is required."),
  // companyId: z.string().min(1, "Company ID is required."),
  candidateName: z.string().min(1, "Candidate Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  currentCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  resumeUrl: z.any().optional(),
});

type EditApplicationFormValues = z.infer<typeof EditApplicationSchema>;

const EditApplication: React.FC<UpdateApplicationProps> = ({
  onUpdate,
  data,
  id,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const methods = useForm<EditApplicationFormValues>({
    resolver: zodResolver(EditApplicationSchema),
    defaultValues: {
      candidateName: "",
      email: "",
      phone: "",
      currentCTC: "",
      noticePeriod: "",
      status: "",
      source: "",
      resumeUrl: undefined,
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    if (data && isModalOpen) {
      // setValue("jobId", data.jobId);
      // setValue("companyId", data.companyId);
      // setValue("candidateName", data.candidateName);
      // setValue("email", data.email);
      // setValue("phone", data.phone);
      // setValue("currentCTC", data.currentCTC || "");
      // setValue("noticePeriod", data.noticePeriod || "");
      // setValue("status", data.status || "");
      // setValue("source", data.source || "");

      reset({
        candidateName: data.candidateName || "",
        email: data.email,
        phone: data.phone,
        currentCTC: data.currentCTC,
        noticePeriod: data.noticePeriod,
        status: data.status,
        source: data.source,
        
      });

      if (data.resumeUrl) {
        setPreviewUrl(data.resumeUrl);
      } else {
        setPreviewUrl(null);
      }

      setSelectedFile(null);
    }
  }, [data, isModalOpen, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 1024 * 1024) {
      toast.error("Image size exceeds 500KB limit.");
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValue("resumeUrl", file);
    }
  };

  const onSubmit: SubmitHandler<EditApplicationFormValues> = async (
    formData
  ) => {
    try {
      console.log("hirrrrirriri")
      setIsClicked(true);
      const payload = new FormData();
      // payload.append("jobId", formData.jobId);
      // payload.append("companyId", formData.companyId);
      payload.append("candidateName", formData.candidateName);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      if (formData.currentCTC)
        payload.append("currentCTC", formData.currentCTC);
      if (formData.noticePeriod)
        payload.append("noticePeriod", formData.noticePeriod);
      if (formData.status) payload.append("status", formData.status);
      if (formData.source) payload.append("source", formData.source);

      if (selectedFile) {
        payload.append("resumeUrl", selectedFile);
      } else if (data?.resumeUrl) {
        payload.append("resumeUrl", data.resumeUrl);
      }

      const response = await apiClient.put(`/application/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data?.message || "Application updated successfully"
        );
        onUpdate(response.data?.application ?? response.data);
        setIsModalOpen(false);
        reset();
        setSelectedFile(null);
      } else {
        toast.error(response.data?.message || "Failed to update application");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsClicked(false);
    }
  };

  console.log(previewUrl,"pevjjhejhh")

  return (
    <DialogModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      title="Edit Application"
      icon={<Pencil />}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 sm:grid-cols-2"
        >
          <InputField
            label="Candidate Name"
            name="candidateName"
            placeholder="Enter Candidate Name"
            formItemClassName="sm:col-span-2"
          />
          <InputField label="Email" name="email" placeholder="Enter Email" />
          <InputField label="Phone" name="phone" placeholder="Enter Phone" />
          <InputField
            label="Current CTC"
            name="currentCTC"
            placeholder="Current CTC"
          />
          <InputField
            label="Notice Period"
            name="noticePeriod"
            placeholder="Notice Period"
          />
          <InputField label="Status" name="status" placeholder="Status" />
          <InputField label="Source" name="source" placeholder="Source" />

          {/* === Resume Upload (same style as EditCompany) === */}
          <FormItem className="gap-2 grid sm:col-span-2">
            <FormLabel className="text-fontPrimary">Resume</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  onClick={() =>
                    document.getElementById("application-upload")?.click()
                  }
                >
                  <UploadCloud className="w-8 h-8 mb-2 text-fontPrimary" />
                  <p className="text-fontPrimary text-sm">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-500">PDF/JPEG (max 1MB)</p>
                  <input
                    id="application-upload"
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <p className="text-fontPrimary mt-1 text-sm">
                      {selectedFile.name} selected
                    </p>
                  )}
                </div>

 
                {previewUrl  && (
                  
                      <img
                        src={previewUrl}
                        alt="Resume Preview"
                        width={150}
                        height={150}
                        className="object-cover rounded-md w-full max-w-36 h-36"
                      />
                  
                
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button
            className="sm:col-span-2 w-fit justify-self-end mt-4"
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
          >
            {isClicked ? "Updating..." : "Update Application"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditApplication;
