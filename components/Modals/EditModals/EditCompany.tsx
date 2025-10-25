"use client";
import React, { useState, useEffect } from "react";
import { UpdateCompanyProps } from "@/types/companyInterface";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import Button from "@/components/Others/Button";
import { Pencil, UploadCloud } from "lucide-react";
import apiClient from "@/lib/axiosInterceptor";

const editCompanySchema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.string().url("Invalid URL"),
  careerPageUrl: z.string().url("Invalid URL"),
  description: z.string().min(1, "Description is required"),
  file: z.any().optional(),
});

type EditCompanyFormValues = z.infer<typeof editCompanySchema>;

const EditCompany: React.FC<UpdateCompanyProps> = ({ onUpdate, data, id }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const methods = useForm<EditCompanyFormValues>({
    resolver: zodResolver(editCompanySchema),
    defaultValues: {
      name: "",
      websiteUrl: "",
      careerPageUrl: "",
      description: "",
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        websiteUrl: data.websiteUrl,
        careerPageUrl: data.careerPageUrl,
        description: data.description,
      });
    }
  }, [data, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setValue("file", file);
    }
  };

  const onSubmit: SubmitHandler<EditCompanyFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("websiteUrl", data.websiteUrl);
      formData.append("careerPageUrl", data.careerPageUrl);
      formData.append("description", data.description);
      if (selectedFile) formData.append("file", selectedFile);

      const response = await apiClient.put(`/company/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        onUpdate(response.data.company);
        setIsFirstDialogOpen(false);
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
      open={isFirstDialogOpen}
      onOpenChange={setIsFirstDialogOpen}
      title="Edit Company"
      icon={<Pencil />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
               <div className="sm:col-span-2">
            <label className="block mb-1 text-sm text-gray-600">Upload Logo</label>
            <div
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
              onClick={() => document.getElementById("company-file-upload-edit")?.click()}
            >
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload</p>
              <input id="company-file-upload-edit" type="file" className="hidden" onChange={handleFileChange} />
              {selectedFile && <p className="mt-2 text-sm text-green-600">{selectedFile.name} selected</p>}
            </div>
          </div>
          <InputField label="Name" name="name" placeholder="Enter company name" formItemClassName="sm:col-span-2" />
          <InputField label="Website URL" name="websiteUrl" placeholder="https://example.com" />
          <InputField label="Career Page URL" name="careerPageUrl" placeholder="https://careers.example.com" />
          <InputField label="Description" name="description" placeholder="Short description" formItemClassName="sm:col-span-2" />

     

          <Button type="submit" disabled={isClicked || methods.formState.isSubmitting} className="sm:col-span-2 w-fit justify-self-end">
            {isClicked ? "Updating..." : "Update Company"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditCompany;
