"use client";

import apiClient from "@/lib/axiosInterceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import Button from "@/components/Others/Button";
import { useParams } from "next/navigation";
import { description } from "@/components/Charts/DeliveryTimeChart";
import { useDepartments } from "@/context/DepartmentContext";
import TextareaField from "@/components/Form_Fields/TextareaField";
import CustomEditorWrapper from "@/components/CustomEditorWrapper";

const addDepartmentSchema = z.object({
  name: z.string(),
  // role: z.enum(rolesOptions),
  description: z.string(),
});

type AddDepartmentFormValues = z.infer<typeof addDepartmentSchema>;

const AddDepartment: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { departments } = useDepartments();
  const [selectedDept, setSelectedDept] = useState("");
  const params = useParams() as { companyId: string };
  const companyId = params.companyId;

  const deptOptions = departments.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  const methods = useForm<AddDepartmentFormValues>({
    resolver: zodResolver(addDepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<AddDepartmentFormValues> = async (data) => {
    try {
      setIsClicked(true);
      // Function to remove HTML tags from rich text fields
      // const stripHtml = (html: string = "") =>
      //   html
      //     .replace(/<[^>]+>/g, "")
      //     .replace(/\s+/g, " ")
      //     .trim();

      const payload = {
        ...data,
        description:data.description ,
      };

      const response = await apiClient.post(
        `/department?companyId=${companyId}`,
        payload
      );
      console.log(response.data);
      toast.success(response.data.message || "Department added successfully!");
      onAdd(response.data.department);
      setIsOpen(false);
      reset();
      setIsClicked(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      setIsClicked(false);
    }
  };

  return (
    // <DialogModal open={isOpen} onOpenChange={setIsOpen} title={"Add Department"} icon={<Plus />} className="bg-secondary absolute top-5 right-5">
    <DialogModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={"Add Department"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add User"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className=" sm:grid-cols-2">
          <InputField
            label="Enter Department Name"
            name="name"
            placeholder="Enter Department Name"
            className="mb-4"
          />
          {/* <SelectField label="Role" name="role" placeholder="Select Role" options={rolesOptions.map(v => ({ label: v, value: v }))} /> */}
          {/* <InputField label="Enter Description" name="description" placeholder="Enter Description" /> */}
          {/* <TextareaField
                 formItemClassName="sm:col-span-2"
                   label="Description"
                          name={"description"}
                          placeholder={"Enter Your Description"}
                        /> */}
          <div className="sm:col-span-2 text-text font-medium text-sm mb-4">
            <h1 className="mb-2">
              Description <span className="text-red-500 ml-1">*</span>
            </h1>
            <CustomEditorWrapper control={methods.control} name="description" />
          </div>

          <Button
            type="submit"
            className="sm:col-span-2 w-fit justify-self-end"
            disabled={isClicked}
          >
            {isClicked ? "Adding..." : "Add Department"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddDepartment;
