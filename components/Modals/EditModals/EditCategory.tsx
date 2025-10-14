import apiClient from "@/lib/axiosInterceptor";
import { AddProps } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SheetModal from "@/components/Others/SheetModal";
import Button from "@/components/Others/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react"; // Import for upload icon
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";

const addCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
});

type AddCategoryFormValues = z.infer<typeof addCategorySchema>;

const AddCategory: React.FC<AddProps> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State to hold the selected image file

  const methods = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
  });

  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<AddCategoryFormValues> = async (data) => {
    try {
      setIsClicked(true);

      const response = await apiClient.post("/admin/category", data);
      console.log(response.data);
      if ((response as any).status === 201) {
        toast.success((response as any).data.message);
        onAdd((response as any).data.user); // Assuming onAdd expects the new user data
        setIsFirstDialogOpen(false);
        reset();
        setSelectedImage(null); // Clear selected image
        setIsClicked(false);
      } else {
        toast.error((response as any).data.message);
        setIsClicked(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isFirstDialogOpen}
      onOpenChange={setIsFirstDialogOpen}
      title={"Add Category"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add Category"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <InputField
            label="Category Name"
            name={"name"}
            placeholder={"Enter name"}
          />

          <Button
            className="rounded-full justify-self-end cursor-pointer w-fit" // Align button to the right
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
          >
            {methods.formState.isSubmitting
              ? "Adding category..."
              : "Add category"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddCategory;
