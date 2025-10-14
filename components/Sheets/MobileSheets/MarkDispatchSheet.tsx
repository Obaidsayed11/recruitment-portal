"use client";
import InputField from "@/components/Form_Fields/InputField";
import { ArrowLeft, X } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import CustomCamera from "@/components/Others/Camera";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";
import Image from "next/image"; // Import the Next.js Image component
import { usePathname, useRouter } from "next/navigation";

// Define a simpler type for the camera
type CameraType = "sealImage";

interface MarkDispatchSheetProps {
  orderId: string;
}

const MarkDispatchSheet: React.FC<MarkDispatchSheetProps> = ({ orderId }) => {
  console.log("orderId", orderId);
  const router = useRouter();
  const methods = useForm({
    // Simplified default values for the form
    defaultValues: {
      sealNumber: "",
      sealImage: "", // Only one image field is needed now
    },
  });
  const pathName = usePathname();
  const baseUrl = pathName?.startsWith("/dispatcher")
    ? "dc"
    : pathName?.startsWith("/outlet") && "ot";

  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentCameraType, setCurrentCameraType] = useState<CameraType | null>(
    null
  );

  // Watch only the sealImage for the preview
  const sealImage = methods.watch("sealImage");

  const handleImageCapture = (imageSrc: string) => {
    // Simplified handler, always sets the sealImage
    if (currentCameraType) {
      methods.setValue(currentCameraType, imageSrc, { shouldValidate: true });
    }
    setIsCameraOpen(false);
    setCurrentCameraType(null);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    setCurrentCameraType(null);
  };

  const openCamera = (type: CameraType) => {
    setCurrentCameraType(type);
    setIsCameraOpen(true);
  };

  // Simplified remove function for the single seal image
  const removeSealImage = () => {
    methods.setValue("sealImage", "", { shouldValidate: true });
  };

  // The main submission handler
  const onSubmit = async (data: { sealNumber: string; sealImage: string }) => {
    // The 'data' object is automatically passed by react-hook-form's handleSubmit
    try {
      // Send both sealNumber and the base64 sealImage string
      const response = await apiClient.post(
        `/${baseUrl}/orders/${orderId}/seal`,
        {
          sealNumber: data.sealNumber,
          sealImage: data.sealImage,
        }
      );

      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        setIsFirstDialogOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error.response?.data?.message || "Failed to dispatch order.");
    }
  };

  return (
    <>
      <Sheet open={isFirstDialogOpen} onOpenChange={setIsFirstDialogOpen}>
        <SheetTrigger className="w-full">
          <Button type="button" className="w-full">
            Save & Next
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0 w-full" side="left">
          <SheetHeader className="bg-[#F2EB18] sticky top-0 p-4 h-[70px] z-10 items-center w-full">
            <h2 className="line-clamp-1 flex text-text text-sm items-center my-auto self-start gap-2 font-medium">
              <SheetClose>
                <ArrowLeft size={20} />
              </SheetClose>
              Mark Dispatch
            </h2>
          </SheetHeader>

          <FormProvider {...methods}>
            {/* Use the form's handleSubmit to trigger the onSubmit function */}
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="p-4 h-[calc(100vh-140px)] flex flex-col gap-5 justify-between"
            >
              <div className="space-y-4">
                <InputField
                  label="Seal No."
                  name={"sealNumber"}
                  placeholder={"Enter seal number"}
                />

                {/* --- Simplified Image Capture Trigger --- */}
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-700">
                    Capture Seal Image
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => openCamera("sealImage")}
                  >
                    Capture Seal Image
                  </Button>
                </div>

                {/* --- Simplified Image Preview --- */}
                <div className="space-y-3">
                  {sealImage && (
                    <div className="relative w-full h-48 bg-gray-200 rounded-md p-2">
                      {/* Using Next.js Image component for the preview */}
                      <Image
                        src={sealImage}
                        alt="Seal Image Preview"
                        fill
                        className="object-contain"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 z-10"
                        onClick={removeSealImage}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {isCameraOpen && (
                <div className="fixed inset-0 bg-black z-50">
                  <CustomCamera
                    onCapture={handleImageCapture}
                    onClose={handleCloseCamera}
                    cameraType={currentCameraType}
                  />
                </div>
              )}

              <div className="mt-auto">
                <Button className="w-full" type="submit">
                  Mark Dispatch
                </Button>
                <p className="text-subtext font-medium text-xs mt-2 text-center">
                  Developed by Sovorun Technologies
                </p>
              </div>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MarkDispatchSheet;
