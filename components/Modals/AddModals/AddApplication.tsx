  "use client";

  import apiClient from "@/lib/axiosInterceptor";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { Pencil, Plus, UploadCloud } from "lucide-react"; 
  import React, { useState } from "react";
  import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
  import { toast } from "sonner";
  import { z } from "zod";
  import DialogModal from "@/components/Others/DialogModal";
  import InputField from "@/components/Form_Fields/InputField";
  import Button from "@/components/Others/Button";
  import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useParams, useSearchParams } from "next/navigation";
  const addApplicationSchema = z.object({
    jobId: z.string(),
    companyId: z.string(),
    candidateName: z.string().min(1, "Candidate Name is required."),
    email: z.string().email("Invalid email."),
    phone: z.string().min(10, "Phone must be at least 10 digits."),
     resume: z.instanceof(File), // Add this
    experience: z.string(),
    skills: z.string().optional(),
    currentCTC: z.string().optional(),
    expectedCTC: z.string().optional(),
    noticePeriod: z.string().optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    Notes: z.string().optional(),
    History: z.string().optional(),
  });

  type AddApplicationFormValues = z.infer<typeof addApplicationSchema>;

  const AddApplication: React.FC<{ onAdd: (data: any) => void }> = ({
    onAdd,
  }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
      const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const params = useParams() as { companyId: string };
const companyId = params.companyId;
    const methods = useForm<AddApplicationFormValues>({
      resolver: zodResolver(addApplicationSchema),
    });

    const { handleSubmit, reset, setValue } = methods;

  const onSubmit: SubmitHandler<AddApplicationFormValues> = async (data) => {
  if (!selectedFile) {
    console.log("submitt")
    toast.error("Please upload your resume.");
    return;
  }

  try {
    setIsClicked(true);

    const formData = new FormData();
    formData.append("candidateName", data.candidateName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("jobId", data.jobId || ""); // add proper jobId
    formData.append("companyId", data.companyId || ""); // add proper companyId
    formData.append("resume", selectedFile);

    // Skills (array)
    if (data.skills) {
      data.skills.split(",").forEach((skill) => {
        formData.append("skills[]", skill.trim());
      });
    }

    // Experience (array of objects)
    if (data.experience) {
      try {
        const expArray = JSON.parse(data.experience); // expects JSON string from input
        expArray.forEach((exp: any, index: number) => {
          formData.append(`experience[${index}][company]`, exp.company);
          formData.append(`experience[${index}][role]`, exp.role);
          formData.append(`experience[${index}][years]`, exp.years.toString());
        });
      } catch {
        toast.error("Experience must be a valid JSON array");
        setIsClicked(false);
        return;
      }
    }

    const response = await apiClient.post("/applications/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Application added successfully!");
    onAdd(response.data.data); // pass the created application object
    setIsOpen(false);
    reset();
    setSelectedFile(null);
    setIsClicked(false);
  } catch (error: any) {
    toast.error(error.response?.data?.message || error.message);
    setIsClicked(false);
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <InputField
              label="Candidate Name"
              name="candidateName"
              placeholder="Enter Name"
            />
            <InputField label="Email" name="email" placeholder="Enter Email" />
            <InputField label="Phone" name="phone" placeholder="Enter Phone" />
            {/* <InputField label="resume URL" name="resumeUrl" placeholder="Enter Resume Url" /> */}
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

              <InputField label="Experience" name="experience" placeholder="Enter Your Total Experience" />
              <InputField label="skills" name="skills" placeholder="Enter Your Total Experience" />
              
            <InputField
              label="Current CTC"
              name="currentCTC"
              placeholder="Current CTC"
            />
            <InputField
              label="Current CTC"
              name="expectedCTC"
              placeholder="Current CTC"
            />
            <InputField
              label="Notice Period"
              name="noticePeriod"
              placeholder="Notice Period"
            />
            {/* <InputField label="Status" name="status" placeholder="Status" /> */}
            <InputField label="Source" name="source" placeholder="Source" />
            <InputField label="Notes" name="Notes" placeholder="Source" />
            <InputField label="History" name="History" placeholder="History" />
            <Button type="submit" className="sm:col-span-2" disabled={isClicked}>
              {isClicked ? "Adding..." : "Add Application"}
            </Button>
          </form>
        </FormProvider>
      </DialogModal>
    );
  };

  export default AddApplication;
