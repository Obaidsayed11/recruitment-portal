"use client";

import apiClient from "@/lib/axiosInterceptor";
import { AddProps, UpdateUserProps } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
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
import { UploadCloud } from "lucide-react"; // Import for upload icon
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";

const Roles = z.enum(["RECRUITER", "HR"]);
type Role = z.infer<typeof Roles>;

const EditserSchema = z.object({
  fullName: z.string().min(1, "Fullname is required."),
  role: Roles,
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  email: z.string().email("Invalid email address."),
  companyId: z.string().optional(),
  // image: z.any().optional(),
});

type EditUserFormValues = z.infer<typeof EditserSchema>;

const EditUser: React.FC<UpdateUserProps> = ({ onUpdate, data, id }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State to hold the selected image file
  const [editedUsers, setEditedUsers] = useState<UpdateUserProps[]>([]);

  const methods = useForm<EditUserFormValues>({
    resolver: zodResolver(EditserSchema),
    defaultValues: {
      // fullName: "",
      // role: undefined,
      // phone: "",
      // email: "",
      companyId: "",
      // image: undefined,
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (data) {
      console.log(data, "role in data");
      reset({
        fullName: data.fullName || "",
        role: data.role || "",
        phone: data.phone || "",
        email: data.email || "",
        companyId: data.companyId || "",
      });
    }
  }, [data, reset]);

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     if (file.size > 500 * 1024) {
  //       toast.error("Image size exceeds 500KB limit.");
  //       setSelectedImage(null);
  //       event.target.value = ""; // Clear the input
  //       return;
  //     }
  //     setSelectedImage(file);
  //     setValue("image", file); // Set the file to the form field
  //   }
  // };
  const roleOptions = ["RECRUITER", "HR"].map((value) => ({
    label: value,
    value,
  }));

//   const onSubmit: SubmitHandler<EditUserFormValues> = async (data) => {
//     try {
//       setIsClicked(true);
//       const formData = new FormData();
//       formData.append("fullName", data.fullName);
//       formData.append("role", data.role);
//       formData.append("phone", data.phone);
//       // formData.append("companyId",data.companyId || null)
//       formData.append("email", data.email);
//       // if (selectedImage) {
//       //   formData.append("image", selectedImage);
//       // }

//       // ✅ Append companyId correctly if it exists
//       // if (data.companyId) {
//       //   formData.append("companyId", data.companyId);
//       // } else {
//       //   // Properly send actual null, not "null" string
//       //   formData.append("companyId", JSON.stringify(null));
//       // }
// formData.append("companyId", data.companyId || "");

      
//       console.log(
//         "📦 Final form data:",
//         Object.fromEntries(formData.entries())
//       );
//       console.log("Add User Data:", Object.fromEntries(formData.entries())); // Log form data
//       const response = await apiClient.put(`/user/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log(response.data);

//       if (response.status === 200 || response.status === 201) {
//         toast.success(response.data.message || "User updated successfully");
//         onUpdate(response.data.user);
//         setIsFirstDialogOpen(false);
//         reset();
//         setSelectedImage(null);
//       } else {
//         toast.error((response as any).data.message);
//         setIsClicked(false);
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || error.message);
//       setIsClicked(false);
//     }
//   };


const onSubmit: SubmitHandler<EditUserFormValues> = async (data) => {
  try {
    setIsClicked(true);

//     const formData = new FormData();
//     formData.append("fullName", data.fullName);
//     formData.append("role", data.role);
//     formData.append("phone", data.phone);
//     formData.append("email", data.email);

//     // ✅ Append empty string if no companyId
//  formData.append("companyId", data.companyId || "");

 const payload = {
        fullName: data?.fullName,
        email: data?.email,
        phone: data?.phone,
        companyId: data?.companyId || null,
        role: data?.role,
      };

    console.log("📦 Final FormData:", (payload));

    const response = await apiClient.put(`/user/${id}`, payload) 

    console.log("✅ Response:", response.data);

    if (response.status === 200 || response.status === 201) {
      toast.success(response.data.message || "User updated successfully");

      // ✅ Update the card immediately without reload
      onUpdate(response.data.user);

      setIsFirstDialogOpen(false);
      reset();
      setSelectedImage(null);
    } else {
      toast.error(response.data.message || "Failed to update user");
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
      icon={<Pencil size={18} />}
      title={"Edit User"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 sm:grid-cols-2"
        >
          <InputField
            label="Name"
            name={"fullName"}
            placeholder={"Enter full name"}
            formItemClassName=" sm:col-span-2"
          />

          {/* <FormItem className="gap-2 grid  sm:col-span-2">
            <FormLabel className="text-text text-sm">User Image</FormLabel>
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
          </FormItem> */}

          <SelectField
            label="Role"
            name={"role"}
            placeholder={"Select Role"}
            options={roleOptions}
            formItemClassName=" sm:col-span-2"
          />

          <InputField
            label="Phone"
            name={"phone"}
            placeholder={"Enter phone number"}
          />
          <InputField
            label="Email"
            name={"email"}
            placeholder={"Enter email"}
          />

          <Button
            className="rounded-full justify-self-end cursor-pointer mt-4 w-fit  sm:col-span-2" // Align button to the right
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
          >
            {/* {methods.formState.isSubmitting ? "Adding User..." : "Add User"} */}
            {isClicked ? "Updating..." : "Update User"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditUser;
