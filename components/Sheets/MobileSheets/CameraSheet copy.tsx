"use client";
import InputField from "@/components/Form_Fields/InputField";
import { ArrowLeft, Camera, CircleUser, LogOut } from "lucide-react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CameraComponent from "@/components/Others/Camera";
import CustomCamera from "@/components/Others/Camera";

const CameraSheet = () => {
  const methods = useForm();
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <button className="flex items-center gap-2 border rounded-lg p-5 text-text justify-center h-[100px] w-full">
            <Camera /> Capture Seal Image
          </button>
        </SheetTrigger>
        <SheetContent className="p-0 w-full">
          <SheetHeader className="p-0"></SheetHeader>

          <CustomCamera />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CameraSheet;
