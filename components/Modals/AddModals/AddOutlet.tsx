import apiClient from "@/lib/axiosInterceptor";
import { AddProps } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Plus } from "lucide-react";
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
import Pincode from "@/components/Others/Pincode";
import { Textarea } from "@/components/ui/textarea";
import DialogModal from "@/components/Others/DialogModal";
import InputField from "@/components/Form_Fields/InputField";
import TextareaField from "@/components/Form_Fields/TextareaField";

const addOutletSchema = z.object({
  user: z.string().optional(),
  name: z.string(),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Invalid pincode format. Must be a 6-digit number"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),

  // Point of Contact
  pocName: z.string().min(1, "PoC Name is required."),
  designation: z.string().min(1, "Designation is required."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .max(10, "Phone number must be 10 digits."),
  email: z.string().email("Invalid email address."),
});

type AddOutletFormValues = z.infer<typeof addOutletSchema>;

const AddOutlet: React.FC<AddProps> = ({ onAdd }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 for Outlet Details, 2 for Point of Contact

  const methods = useForm<AddOutletFormValues>({
    resolver: zodResolver(addOutletSchema),
    shouldUnregister: false,
  });

  const { handleSubmit, reset, trigger, setValue } = methods;

  const handlePincodeSelect = (data: any) => {
    setValue("pincode", data.pincode);
    setValue("area", data.area);
    setValue("state", data.state);
    setValue("city", data.district);
  };

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["name", "latitude", "longitude", "address"]);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields for Outlet Details.");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit: SubmitHandler<AddOutletFormValues> = async (data) => {
    setIsClicked(true);

    try {
      // Construct user payload
      const userPayload = {
        fullName: data.pocName,
        phone: data.phone,
        designation: data.designation,
        email: data.email,
        role: "OUTLET" as const,
      };

      // Create user
      const userRes = await apiClient.post("/admin/user", userPayload);
      const user = userRes?.data?.user;

      if (!user || !user.id) {
        throw new Error("User creation failed. Missing user ID.");
      }

      // Construct outlet payload
      const outletPayload = {
        user: user.id,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        pincode: data.pincode,
        area: data.area,
        city: data.city,
        state: data.state,
      };

      // Create outlet
      const outletRes = await apiClient.post("/admin/outlet", outletPayload);
      const outletData = outletRes.data.outlet;

      if (outletRes.status === 201) {
        toast.success(outletRes.data.message || "Outlet added successfully.");
        onAdd(outletData);
        setIsFirstDialogOpen(false);
        reset();
      } else {
        toast.error(outletData.message || "Failed to create outlet.");
      }
    } catch (error: any) {
      console.error("Outlet creation error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <DialogModal
      open={isFirstDialogOpen}
      onOpenChange={setIsFirstDialogOpen}
      icon={<Plus />}
      title={"Add Outlet"}
      name={"Add Outlet"}
      className="sm:max-w-[500px]"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 sm:gap-5 sm:grid-cols-2"
        >
          <div className="flex items-center font-medium justify-start gap-2 border-b pb-2 sm:col-span-2">
            <span className={`text-sm text-[#2D8037]`}>Outlet Details</span>
            <ChevronRight
              size={16}
              className={`${
                currentStep === 2 ? "text-[#2D8037]" : "text-subtext"
              }`}
            />
            <span
              className={`text-sm ${
                currentStep === 2 ? "text-[#2D8037]" : "text-[#999]"
              }`}
            >
              Point of Contact
            </span>
          </div>

          <div
            className={
              currentStep === 1
                ? "grid gap-3 sm:gap-5 sm:grid-cols-2 col-span-2"
                : "hidden"
            }
          >
            <InputField
              label="Outlet Name"
              name={"name"}
              formItemClassName="sm:col-span-2"
              placeholder={"Enter outlet name"}
            />
            <InputField
              label="Latitude"
              name={"latitude"}
              placeholder={"Enter Latitude"}
            />
            <InputField
              label="Longitude"
              name={"longitude"}
              placeholder={"Enter longitude"}
            />

            <TextareaField
              label="Outlet Address"
              name={"address"}
              placeholder={"Enter address"}
              formItemClassName="sm:col-span-2"
            />

            <Pincode
              onAreaSelect={handlePincodeSelect}
              className="sm:col-span-2"
            />

            <Button
              className="rounded-full justify-self-end cursor-pointer w-fit sm:col-span-2"
              type="button"
              onClick={handleNext}
            >
              Save & Next
            </Button>
          </div>

          <div
            className={
              currentStep === 2
                ? "grid gap-3 sm:gap-5 sm:grid-cols-2 col-span-2"
                : "hidden"
            }
          >
            <InputField
              label="POC Name"
              name={"pocName"}
              placeholder={"Enter name"}
              formItemClassName="sm:col-span-2"
            />
            <InputField
              label="Designation"
              name={"designation"}
              placeholder={"Enter designation"}
              formItemClassName="sm:col-span-2"
            />
            <InputField
              label="Phone"
              name={"phone"}
              placeholder={"Enter phone"}
            />
            <InputField
              label="Email"
              name={"email"}
              placeholder={"Enter email"}
            />

            <div className="flex gap-5 items-center col-span-2 justify-self-end">
              <button
                type="button"
                className="rounded-md px-4 py-2 cursor-pointer w-fit bg-secondary border border-secondary text-text"
                onClick={handleBack}
              >
                Back
              </button>
              <Button
                className="rounded-full cursor-pointer w-fit"
                type="submit"
                disabled={isClicked || methods.formState.isSubmitting}
              >
                {methods.formState.isSubmitting
                  ? "Adding Outlet..."
                  : "Add Outlet"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default AddOutlet;
