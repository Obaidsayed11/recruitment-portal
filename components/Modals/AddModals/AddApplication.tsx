// "use client";

// import apiClient from "@/lib/axiosInterceptor";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Pencil, Plus, UploadCloud } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import DialogModal from "@/components/Others/DialogModal";
// import InputField from "@/components/Form_Fields/InputField";
// import Button from "@/components/Others/Button";
// import {
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
//   FormField,
// } from "@/components/ui/form";
// import { useParams, useSearchParams } from "next/navigation";
// import { Combobox } from "@/components/Others/ComoboboxDemo";
// const addApplicationSchema = z.object({
//   jobId: z.string(),
//   companyId: z.string().optional(),
//   candidateName: z.string().min(1, "Candidate Name is required."),
//   email: z.string().email("Invalid email."),
//   phone: z.string().min(10, "Phone must be at least 10 digits."),
//   resume: z.instanceof(File), 
//   experiences: z.array(z.object({
//     company: z.string().min(1, "Company required"),
//     role: z.string().min(1, "Role required"),
//     years: z.string().min(1, "Years required") // Keep as string
//   })).min(1, "At least one experience required"),
//   skills: z.string().optional(),
//   currentCTC: z.string().optional(),
//   expectedCTC: z.string().optional(),
//   noticePeriod: z.string().optional(),
//   status: z.string().optional(),
//   source: z.string().optional(),
//   Notes: z.string().optional(),
//   History: z.string().optional(),
// });

// type AddApplicationFormValues = z.infer<typeof addApplicationSchema>;

// const AddApplication: React.FC<{ onAdd: (data: any) => void }> = ({
//   onAdd,
// }) => {
//   const [isClicked, setIsClicked] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [description, setDescription] = useState<
//     { id: string; title: string }[]
//   >([]);
//     const [experiences, setExperiences] = useState([
//     { company: "", role: "", years: 0 }
//   ]);
 
//   const params = useParams() as { companyId: string };
//   const companyId = params.companyId;

//   const methods = useForm<AddApplicationFormValues>({
//     resolver: zodResolver(addApplicationSchema),
//     defaultValues: {
//       experiences: [{ company: "", role: "", years: "" }]
//     }
//   });

//     const addExperience = () => {
//     setExperiences([...experiences, { company: "", role: "", years: 0 }]);
//   };

//   const removeExperience = (index: number) => {
//     if (experiences.length > 1) {
//       setExperiences(experiences.filter((_, i) => i !== index));
//     }
//   };


//   const { handleSubmit, reset, setValue, control } = methods;

//   const onSubmit: SubmitHandler<AddApplicationFormValues> = async (data) => {
//     if (!selectedFile) {
//       toast.error("Please upload your resume.");
//       return;
//     }

//     try {
//       setIsClicked(true);
//       const formData = new FormData();
     

//       formData.append("candidateName", data.candidateName);
//       formData.append("email", data.email);
//       formData.append("phone", data.phone);
//       formData.append("jobId", data.jobId); // ✅ from props
//       formData.append("companyId", companyId); // ✅ from params
//       formData.append("resume", selectedFile);

//       if (data.skills) {
//         data.skills.split(",").forEach((skill) => {
//           formData.append("skills[]", skill.trim());
//         });
//       }

//      // Append experiences
//       data.experiences.forEach((exp, index) => {
//         formData.append(`experience[${index}][company]`, exp.company);
//         formData.append(`experience[${index}][role]`, exp.role);
//         formData.append(`experience[${index}][years]`, exp.years.toString());
//       });

//       const response = await apiClient.post("/application/submit", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success(response.data.message || "Application added successfully!");
//       onAdd(response.data.data);
//       setIsOpen(false);
//       reset();
//       setSelectedFile(null);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || error.message);
//     } finally {
//       setIsClicked(false);
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
//   // console.log(description, "dwdwdwd");

//   return (
//     // <DialogModal open={isOpen} onOpenChange={setIsOpen} title="Add Application" icon={<Plus />}  className="bg-secondary absolute top-5 right-5">
//     <DialogModal
//       open={isOpen}
//       onOpenChange={setIsOpen}
//       title={"Add Application"}
//       className="bg-secondary absolute top-5 right-5"
//       name={"Add User"}
//       icon={<Plus />}
//     >
//       <FormProvider {...methods}>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid gap-4 sm:grid-cols-2"
//         >
//           <FormField
//             control={control}
//             name="jobId"
//             render={({ field }) => (
//               <FormItem className="sm:col-span-1">
//                 <FormLabel className="text-fontPrimary">Department</FormLabel>
//                 <FormControl>
//                   <Combobox
//                     placeholder="Select Department"
//                     options={description.map((dep) => ({
//                       value: dep.id,
//                       label: dep.title,
//                     }))}
//                     value={field.value}
//                     onSelect={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <InputField
//             label="Candidate Name"
//             name="candidateName"
//             placeholder="Enter Name"
//           />
//           <InputField label="Email" name="email" placeholder="Enter Email" />
//           <InputField label="Phone" name="phone" placeholder="Enter Phone" />
//           {/* <InputField label="resume URL" name="resumeUrl" placeholder="Enter Resume Url" /> */}
//           <FormItem className="gap-2 grid sm:col-span-2">
//             <FormLabel className="text-text text-sm">
//               Resume / Attachment
//             </FormLabel>
//             <FormControl>
//               <div
//                 className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
//                 onClick={() =>
//                   document.getElementById("application-image-upload")?.click()
//                 }
//               >
//                 <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
//                 <p className="text-sm text-gray-600">
//                   Click to upload or drag & drop
//                 </p>
//                 <p className="text-xs text-gray-500">JPEG / PDF (max. 1MB)</p>
//                 <input
//                   id="application-image-upload"
//                   type="file"
//                   accept="image/*,application/pdf"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//                 {selectedFile && (
//                   <p className="mt-2 text-sm text-green-600">
//                     {selectedFile.name} selected
//                   </p>
//                 )}
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>

//          {/* Experience Section */}
//           <div className="sm:col-span-2 space-y-4">
//             <div className="flex justify-between items-center">
//               <FormLabel className="text-fontPrimary text-base">Experience</FormLabel>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addExperience}
//               >
//                 <Plus className="h-4 w-4 mr-1" /> Add Experience
//               </Button>
//             </div>

//             {experiences.map((_, index) => (
//               <div key={index} className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
//                 <div className="col-span-4">
//                   <InputField
//                     label="Company"
//                     name={`experiences.${index}.company`}
//                     placeholder="Company name"
//                   />
//                 </div>
//                 <div className="col-span-4">
//                   <InputField
//                     label="Role"
//                     name={`experiences.${index}.role`}
//                     placeholder="Your role"
//                   />
//                 </div>
//                 <div className="col-span-3">
//                   <InputField
//                     label="Years"
//                     name={`experiences.${index}.years`}
//                     type="number"
//                     placeholder="Years"
//                   />
//                 </div>
//                 {experiences.length > 1 && (
//                   <div className="col-span-1 flex items-end">
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => removeExperience(index)}
//                     >
//                       ×
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           {/* <InputField
//             label="skills"
//             name="skills"
//             placeholder="Enter Your Total Experience"
//           /> */}
// {/* 
//           <InputField
//             label="Current CTC"
//             name="currentCTC"
//             placeholder="Current CTC"
//           />
//           <InputField
//             label="Expected CTC"
//             name="expectedCTC"
//             placeholder="Current CTC"
//           /> */}
//           {/* <InputField
//             label="Notice Period"
//             name="noticePeriod"
//             placeholder="Notice Period"
//           /> */}
//           {/* <InputField label="Status" name="status" placeholder="Status" /> */}
//           {/* <InputField label="Source" name="source" placeholder="Source" /> */}
//           {/* <InputField label="Notes" name="Notes" placeholder="Source" />
//           <InputField label="History" name="History" placeholder="History" /> */}
//           <Button type="submit" className="sm:col-span-2" disabled={isClicked}>
//             {isClicked ? "Adding..." : "Add Application"}
//           </Button>
//         </form>
//       </FormProvider>
//     </DialogModal>
//   );
// };

// export default AddApplication;
