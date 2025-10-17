"use client";
import apiClient from "@/lib/axiosInterceptor";
import { AddProps } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Button from "@/components/Others/Button";
import { UploadCloud } from "lucide-react";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";

const companySchema = z.object({
  name: z.string().min(1, "Name is required."),
  websiteUrl: z.string().url("Invalid website URL"),
  careerPageUrl: z.string().url("Invalid career page URL"),
  description: z.string().min(1, "Description is required."),
  file: z.any().optional(),
});

type AddCompanyFormValues = z.infer<typeof companySchema>;

const AddCompany: React.FC<AddProps> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const methods = useForm<AddCompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      websiteUrl: "",
      careerPageUrl: "",
      description: "",
      file: undefined,
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setValue("file", file);
    }
  };

  const onSubmit: SubmitHandler<AddCompanyFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("websiteUrl", data.websiteUrl);
      formData.append("careerPageUrl", data.careerPageUrl);
      formData.append("description", data.description);
      if (selectedFile) formData.append("file", selectedFile);

      const response = await apiClient.post("/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        onAdd(response.data.company);
        setIsDialogOpen(false);
        reset();
        setSelectedFile(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      title="Add Company"
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
          <InputField label="Name" name="name" placeholder="Enter company name" formItemClassName="sm:col-span-2" />
          <InputField label="Website URL" name="websiteUrl" placeholder="Enter website URL" />
          <InputField label="Career Page URL" name="careerPageUrl" placeholder="Enter career page URL" />
          <InputField label="Description" name="description" placeholder="Enter description" formItemClassName="sm:col-span-2" />
          
          <FormItem className="gap-2 grid sm:col-span-2">
            <FormLabel>File</FormLabel>
            <FormControl>
              <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                onClick={() => document.getElementById("company-file-upload")?.click()}
              >
                <UploadCloud className="w-8 h-8 mb-2" />
                <p>Click to upload or drag & drop</p>
                <input
                  id="company-file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {selectedFile && <p>{selectedFile.name} selected</p>}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit" disabled={isClicked} className="sm:col-span-2 w-fit justify-self-end">
            {isClicked ? "Adding..." : "Add Company"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddCompany;
