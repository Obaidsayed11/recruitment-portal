"use client";
import InputField from "@/components/Form_Fields/InputField";
import { ArrowLeft, CircleUser, LogOut } from "lucide-react";
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
import { signOut } from "next-auth/react";

const ProfileSheet = () => {
  const methods = useForm();
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <CircleUser
            className="text-primary cursor-pointer h-8 w-8"
            size={30}
          />
        </SheetTrigger>
        <SheetContent className="p-0 w-full">
          <SheetHeader className="p-0">
            <div className="bg-background border-b sticky top-0 p-4 w-full flex items-center justify-between">
              <h2 className="flex text-text items-center gap-2 font-medium">
                <SheetClose>
                  <ArrowLeft size={20} />
                </SheetClose>
                Profile
              </h2>
              <button
                onClick={() => signOut()}
                className="bg-[#F5F5F5] font-medium gap-2 rounded-full px-4 py-2 flex items-center text-primary cursor-pointer"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </SheetHeader>

          <FormProvider {...methods}>
            <form
              className="p-4 h-full flex flex-col gap-5 justify-between"
              action=""
            >
              <div className="grid gap-3">
                <InputField
                  label="Name"
                  name={"name"}
                  placeholder={"Enter name"}
                />
                <InputField
                  label="Mobile"
                  name={"phone"}
                  placeholder={"Enter mobile"}
                />
                <InputField
                  label="Email"
                  name={"email"}
                  placeholder={"Enter email"}
                />
              </div>
              <div>
                <Button className="w-full" type="submit">
                  Save info
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

export default ProfileSheet;
