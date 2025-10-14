import apiClient from "@/lib/axiosInterceptor";
import { AddProps } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
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
import DateInputField from "@/components/Form_Fields/DateField";

const addUserSchema = z.object({
  fullName: z.string().min(1, "Fullname is required."),
  role: z.string(),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  email: z.string().email("Invalid email address."),
  image: z.any().optional(),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

const AddDriver: React.FC<AddProps> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State to hold the selected image file

  const methods = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      fullName: "",
      role: "DRIVER",
      phone: "",
      email: "",
      image: undefined,
    },
  });

  const { handleSubmit, reset, setValue } = methods;

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
  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    try {
      setIsClicked(true);
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("role", "DRIVER");
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      console.log("Add User Data:", Object.fromEntries(formData.entries())); // Log form data
      const response = await apiClient.post("/admin/user", formData, {
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
      title={"Add Driver"}
      className="bg-secondary absolute top-5 right-5"
      name={"Add Driver"}
      icon={<Plus />}
    >
      {/* <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 sm:gap-5 sm:grid-cols-2"
        >
          <h3 className="sm:col-span-2 sm:text-base text-sm text-primary font-medium bg-accent px-4 py-1 rounded-md">
            Company Details
          </h3>
          <InputField
            label="Name"
            name={"companyName"}
            placeholder={"Enter name"}
            formItemClassName="sm:col-span-2"
          />
          <InputField
            label="Phone"
            name={"companyPhone"}
            placeholder={"Enter phone"}
          />
          <InputField
            label="Email"
            name={"companyEmail"}
            placeholder={"Enter email"}
          />
          <h3 className="sm:col-span-2 sm:text-base text-sm text-primary mt-5 font-medium bg-accent px-4 py-1 rounded-md">
            Driver Details
          </h3>
          <InputField
            label="Name"
            name={"companyName"}
            placeholder={"Enter name"}
            formItemClassName="sm:col-span-2"
          />
          <InputField
            label="Phone"
            name={"companyPhone"}
            placeholder={"Enter phone"}
          />
          <InputField
            label="Email"
            name={"companyEmail"}
            placeholder={"Enter email"}
          />
          <InputField
            label="Driving License No."
            name={"licenseNumber"}
            placeholder={"Enter number"}
          />
          <DateInputField
            label="License Validity"
            name={"validity"}
            placeholder={"Select date"}
          />
          <FormItem className="sm:col-span-2 gap-2 grid">
            <FormLabel className="text-text text-sm">License Photo</FormLabel>
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
          <h3 className="sm:col-span-2 text-primary sm:text-base text-sm font-medium bg-accent px-4 py-1 rounded-md">
            Vehilcle Details
          </h3>
          <InputField
            label="Vehicle Name"
            name={"vehicleName"}
            placeholder={"Enter name"}
          />
          <InputField
            label="Vehicle Number"
            name={"vehicleNumber"}
            placeholder={"Enter number"}
          />

          <Button
            className="rounded-full justify-self-end cursor-pointer w-fit" // Align button to the right
            type="submit"
            disabled={isClicked || methods.formState.isSubmitting}
          >
            {methods.formState.isSubmitting ? "Adding Driver..." : "Add Driver"}
          </Button>
        </form>
      </FormProvider> */}
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

          <FormItem className="gap-2 grid  sm:col-span-2">
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
          </FormItem>

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
            {methods.formState.isSubmitting ? "Adding Driver..." : "Add Driver"}
          </Button>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddDriver;
