import apiClient from "@/lib/axiosInterceptor";
import { AddProps, CategoryListProps, CategoryProps } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { Combobox } from "@/components/Others/ComoboboxDemo";

// New Schema for Add User Form
const addProductSchema = z.object({
  categoryId: z.string(),
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long." })
    .max(100, { message: "Product name must not exceed 100 characters." }),
  code: z.string().max(20, { message: "Code must not exceed 20 characters." }),
  image: z.any().optional(), // For file upload, will handle separately
});

type AddProductFormValues = z.infer<typeof addProductSchema>;

const AddProduct: React.FC<AddProps> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State to hold the selected image file
  const { data: session } = useSession();
  const [allCategory, setAllCategory] = useState<CategoryProps[]>([]);

  const methods = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      code: "",
      image: undefined,
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await apiClient.get<CategoryListProps>(
            `/admin/categories`
          );
          const data = response.data.categories;
          setAllCategory(data);
        } catch (error) {
          console.error("Error fetching plants data:", error);
        }
      };
      fetchData();
    }
  }, [session]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 500 * 1024) {
        toast.error("Image size exceeds 500KB limit.");
        setSelectedImage(null);
        event.target.value = ""; // Clear the input
        return;
      }
      setSelectedImage(file);
      setValue("image", file); // Set the file to the form field
    }
  };

  const onSubmit: SubmitHandler<AddProductFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("categoryId", data.categoryId);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      console.log("Add User Data:", Object.fromEntries(formData.entries())); // Log form data
      const response = await apiClient.post("/admin/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);

      if ((response as any).status === 201) {
        toast.success((response as any).data.message);
        onAdd((response as any).data.user);
        setIsFirstDialogOpen(false);
        reset();
        setSelectedImage(null);
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
      title={"Add Product"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add Product"}
      icon={<Plus />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:gap-5">
          <FormItem className="gap-2 grid">
            <FormLabel className="text-text text-sm">Product Photo</FormLabel>
            <FormControl>
              <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                onClick={() =>
                  document.getElementById("user-image-upload")?.click()
                }
              >
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-500">JPEG (max. 500kb)</p>
                <input
                  id="user-image-upload"
                  type="file"
                  accept="image/jpeg"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <p className="mt-2 text-sm text-green-600">
                    {selectedImage.name} selected
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <InputField
            label="SKU Code"
            name={"code"}
            placeholder={"Enter SKU code"}
          />
          <InputField
            label="Name"
            name={"name"}
            placeholder={"Enter full name"}
          />
          <FormField
            control={methods.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-fontPrimary">Select Store</FormLabel>
                <FormControl>
                  <Combobox
                    placeholder="Category"
                    options={allCategory.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                    value={field.value || 0}
                    onSelect={(value: number) => {
                      field.onChange(value);
                    }}
                    className={
                      methods.formState.errors.categoryId
                        ? " border-red-500"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="rounded-full justify-self-end cursor-pointer mt-4 w-fit" // Align button to the right
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
          >
            {methods.formState.isSubmitting
              ? "Adding Product..."
              : "Add Product"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddProduct;
