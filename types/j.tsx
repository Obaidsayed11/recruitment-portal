// import apiClient from "@/lib/axiosInterceptor";
// import { AddProps, CategoryListProps, CategoryProps } from "@/types/interface";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Plus, UploadCloud } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import Button from "@/components/Others/Button";
// import DialogModal from "@/components/Others/DialogModal";
// import InputField from "@/components/Form_Fields/InputField";
// import { useSession } from "next-auth/react";
// import { Combobox } from "@/components/Others/ComoboboxDynamic";
// import Image from "next/image";
// import { useParams } from "next/navigation";

// // Updated schema to match the backend validation
// const addProductSchema = z.object({
//   categoryId: z
//     .string({ required_error: "Category is required." })
//     .min(1, { message: "Category is required." }),
//   name: z
//     .string()
//     .min(3, { message: "Product name must be at least 3 characters long." })
//     .max(100, { message: "Product name must not exceed 100 characters." }),
//   code: z
//     .string()
//     .max(20, { message: "Code must not exceed 20 characters." })
//     .optional()
//     .or(z.literal("")),
//   image: z.any().optional(),
//   hsnCategory: z
//     .string()
//     .max(50, { message: "HSN Category must not exceed 50 characters." })
//     .optional()
//     .or(z.literal("")),
//   defaultUnit: z
//     .string()
//     .max(20, { message: "Default unit must not exceed 20 characters." })
//     .optional()
//     .or(z.literal("")),
//   defaultWeightUom: z
//     .string()
//     .max(20, { message: "Default weight UOM must not exceed 20 characters." })
//     .optional()
//     .or(z.literal("")),
//   // Using coerce to handle number conversion from string input
//   defaultWeightKg: z.coerce
//     .number({ invalid_type_error: "Default weight must be a number." })
//     .nonnegative({ message: "Default weight cannot be negative." })
//     .optional()
//     .or(z.literal("")),
// });

// type AddProductFormValues = z.infer<typeof addProductSchema>;

// const AddProduct: React.FC<AddProps> = ({ onAdd }) => {
//   const [isClicked, setIsClicked] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [allCategories, setAllCategories] = useState<CategoryProps[]>([]);
//   const { data: session } = useSession();
//   const params = useParams<{ cid: any }>();

//   const methods = useForm<AddProductFormValues>({
//     resolver: zodResolver(addProductSchema),
//     defaultValues: {
//       name: "",
//       categoryId: "",
//       code: "",
//       image: undefined,
//       hsnCategory: "",
//       defaultUnit: "",
//       defaultWeightUom: "",
//       defaultWeightKg: "",
//     },
//   });

//   const { handleSubmit, reset, setValue } = methods;
//   useEffect(() => {
//     if (session) {
//       const fetchData = async () => {
//         try {
//           const response = await apiClient.get<CategoryListProps>(
//             `/categories`
//           );
//           setAllCategories(response.data.categories || []);
//         } catch (error: any) {
//           toast.error("Failed to fetch categories.");
//           console.error(error);
//         }
//       };
//       fetchData();
//     }
//   }, [session]);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       if (file.size > 500 * 1024) {
//         toast.error("Image size exceeds 500KB limit.");
//         setSelectedImage(null);
//         event.target.value = "";
//         return;
//       }
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setValue("image", file);
//     }
//   };

//   const categoryOptions = useMemo<any[]>(() => {
//     return allCategories.map((category) => ({
//       label: category.name,
//       value: category.id,
//     }));
//   }, [allCategories]);

//   const onSubmit: SubmitHandler<AddProductFormValues> = async (data) => {
//     if (!params?.cid) {
//       toast.error("Client ID not found. Please log in again.");
//       return;
//     }

//     setIsClicked(true);
//     try {
//       const formData = new FormData();

//       // Append required fields from schema
//       formData.append("clientId", params?.cid);
//       formData.append("categoryId", data.categoryId);
//       formData.append("name", data.name);

//       // Append optional fields only if they have a value
//       if (data.code) formData.append("code", data.code);
//       if (data.hsnCategory) formData.append("hsnCategory", data.hsnCategory);
//       if (data.defaultUnit) formData.append("defaultUnit", data.defaultUnit);
//       if (data.defaultWeightUom)
//         formData.append("defaultWeightUom", data.defaultWeightUom);
//       if (data.defaultWeightKg) {
//         formData.append("defaultWeightKg", data.defaultWeightKg.toString());
//       }
//       if (selectedImage) {
//         formData.append("image", selectedImage);
//       }

//       const response = await apiClient.post("/product", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 201 || response.status === 200) {
//         toast.success(response.data.message || "Product added successfully!");
//         onAdd(response.data.product);
//         setIsDialogOpen(false);
//         reset();
//         setSelectedImage(null);
//         setPreviewUrl(null);
//       } else {
//         toast.error(response.data.message || "Failed to add product.");
//       }
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "An unexpected error occurred."
//       );
//     } finally {
//       setIsClicked(false);
//     }
//   };

//   return (
//     <DialogModal
//       open={isDialogOpen}
//       onOpenChange={setIsDialogOpen}
//       title={"Add Product"}
//       className="bg-secondary absolute top-5 right-5"
//       name={"Add Product"}
//       icon={<Plus />}
//     >
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           <FormItem className="gap-2 grid">
//             <FormLabel className="text-text text-sm">Product Photo</FormLabel>
//             <FormControl>
//               <div className="flex items-center gap-4">
//                 <div
//                   className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 w-full"
//                   onClick={() =>
//                     document.getElementById("product-image-upload")?.click()
//                   }
//                 >
//                   <UploadCloud size={24} className="text-subtext/70 mb-2" />
//                   <p className="text-sm text-subtext text-center">
//                     Click to upload or drag & drop
//                   </p>
//                   <p className="text-xs text-subtext/70">JPEG (max. 500kb)</p>
//                   <input
//                     id="product-image-upload"
//                     type="file"
//                     accept="image/jpeg"
//                     className="hidden"
//                     onChange={handleImageChange}
//                   />
//                   {selectedImage && (
//                     <p className="mt-2 line-clamp-1 text-xs text-primary">
//                       {selectedImage.name} selected
//                     </p>
//                   )}
//                 </div>
//                 {previewUrl && (
//                   <Image
//                     src={previewUrl}
//                     alt="Selected image preview"
//                     width={150}
//                     height={150}
//                     className="object-cover rounded-md w-full max-w-36 h-36"
//                   />
//                 )}
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>

//           <InputField
//             label="Product Name"
//             name={"name"}
//             placeholder={"Enter product name"}
//           />
//           <FormField
         

import apiClient from "@/lib/axiosInterceptor";
import {
  CategoryListProps,
  CategoryProps,
  UpdateProductsProps,
} from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UploadCloud } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Button from "@/components/Others/Button";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import { useSession } from "next-auth/react";
import { Combobox } from "@/components/Others/ComoboboxDynamic";
import Image from "next/image";
import { BASE_URL } from "@/config";
import { useParams } from "next/navigation";
import { useCategories } from "@/context/CategoryContext";

// Schema for Edit Product Form
const EditProductSchema = z.object({
  categoryId: z
    .string({ required_error: "Category is required." })
    .min(1, { message: "Category is required." }),
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long." })
    .max(100, { message: "Product name must not exceed 100 characters." }),
  code: z
    .string()
    .max(20, { message: "Code must not exceed 20 characters." })
    .optional()
    .or(z.literal("")),
  image: z.any().optional(),
  hsnCategory: z
    .string()
    .max(50, { message: "HSN Category must not exceed 50 characters." })
    .optional()
    .or(z.literal("")),
  defaultUnit: z
    .string()
    .max(20, { message: "Default unit must not exceed 20 characters." })
    .optional()
    .or(z.literal("")),
  defaultWeightUom: z
    .string()
    .max(20, { message: "Default weight UOM must not exceed 20 characters." })
    .optional()
    .or(z.literal("")),
  defaultWeightKg: z.coerce
    .number({ invalid_type_error: "Default weight must be a number." })
    .nonnegative({ message: "Default weight cannot be negative." })
    .optional()
    .or(z.literal("")),
});

type EditProductFormValues = z.infer<typeof EditProductSchema>;

const EditProduct: React.FC<UpdateProductsProps> = ({ onUpdate, data, id }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { data: session } = useSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const params = useParams<{ cid: any }>();
  const { categories: allCategories, loading: categoriesLoading } =
    useCategories();

  const methods = useForm<EditProductFormValues>({
    resolver: zodResolver(EditProductSchema),
  });

  const { handleSubmit, reset, setValue } = methods;

  // Corrected useEffect to populate all form fields
  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? "",
        categoryId: data.Category.id ?? "",
        code: data.code ?? "",
        image: data.image ?? "",
        hsnCategory: data.hsnCategory ?? "",
        defaultUnit: data.defaultUnit ?? "",
        defaultWeightUom: data.defaultWeightUom ?? "",
        defaultWeightKg: data.defaultWeightKg ?? "",
      });
      // Set initial preview for existing image
      if (data.image) {
        setPreviewUrl(`${BASE_URL}${data.image}`);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [data, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 500 * 1024) {
        toast.error("Image size exceeds 500KB limit.");
        event.target.value = "";
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  // Create options for the Combobox
  const categoryOptions = useMemo<any[]>(() => {
    return allCategories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [allCategories]);

  // Corrected onSubmit for updating product
  const onSubmit: SubmitHandler<EditProductFormValues> = async (
    formDataValues
  ) => {
    setIsClicked(true);
    try {
      const formData = new FormData();
      formData.append("categoryId", formDataValues.categoryId);
      formData.append("name", formDataValues.name);
      formData.append("clientId", `${params?.cid}`);

      if (formDataValues.code) formData.append("code", formDataValues.code);
      if (formDataValues.hsnCategory)
        formData.append("hsnCategory", formDataValues.hsnCategory);
      if (formDataValues.defaultUnit)
        formData.append("defaultUnit", formDataValues.defaultUnit);
      if (formDataValues.defaultWeightUom)
        formData.append("defaultWeightUom", formDataValues.defaultWeightUom);
      if (formDataValues.defaultWeightKg) {
        formData.append(
          "defaultWeightKg",
          formDataValues.defaultWeightKg.toString()
        );
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await apiClient.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Product updated successfully!");
        onUpdate(response.data.product);
        setIsFirstDialogOpen(false);
        setSelectedImage(null); // Clear selected image after successful upload
      } else {
        toast.error(response.data.message || "Failed to update product.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isFirstDialogOpen}
      onOpenChange={setIsFirstDialogOpen}
      title={"Update Product"}
      className="bg-secondary absolute top-5 right-5"
      icon={<Pencil size={20} />}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <FormItem className="gap-2 grid">
            <FormLabel className="text-text text-sm">Product Photo</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 w-full"
                  onClick={() =>
                    document
                      .getElementById("product-image-upload-edit")
                      ?.click()
                  }
                >
                  <UploadCloud size={24} className="text-subtext/70 mb-2" />
                  <p className="text-sm text-subtext text-center">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-subtext/70">JPEG (max. 500kb)</p>
                  <input
                    id="product-image-upload-edit"
                    type="file"
                    accept="image/jpeg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <p className="mt-2 line-clamp-1 text-xs text-primary">
                      {selectedImage.name} selected
                    </p>
                  )}
                </div>
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Product image preview"
                    width={150}
                    height={150}
                    className="object-cover rounded-md w-full max-w-36 h-36"
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
    </form>
     </FormProvider>
     </DialogModal>
  )
}
