"use client";
import InputField from "@/components/Form_Fields/InputField";
import {
  ArrowLeft,
  ChevronDown,
  CircleChevronRightIcon,
  CircleQuestionMark,
  CircleUser,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
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
import DriversSvg from "@/components/Svgs/DriversSvg";
import DarkStoreSvg from "@/components/Svgs/DarkStore";
import CategorySheet from "./CategorySheet";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface ReceiverProofProps {
  data: any;
  index: number;
}

const ReceiverProof: React.FC<ReceiverProofProps> = ({ data, index }) => {
  const methods = useForm();
  const [openDetailView, setOpenDetailView] = useState(false);

  const handleDetailView = () => {
    setOpenDetailView((prev) => !prev);
  };
  return (
    <>
      <Sheet>
        <SheetTrigger className="w-full text-left">
          <div
            className={`${
              index % 2 ? "bg-white" : "bg-[#F5F5F5]"
            } grid grid-cols-[1fr_30px] items-center p-3 py-5`}
          >
            <div className="grid gap-2">
              <span className="text-xs text-text">
                Invoice No.:{" "}
                <strong className="font-semibold">4654987654643246</strong>
              </span>
              <div className="grid grid-cols-2 gap-3">
                <span className="text-xs text-text">
                  From warehouse.: <strong>Warehouse 1</strong>
                </span>
                <span className="text-xs text-text">
                  To Outlet.: <strong>Andheri</strong>
                </span>
              </div>
            </div>

            <CircleChevronRightIcon size={25} color="#494949" />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="gap-0 p-0 w-full">
          <SheetHeader className="p-0">
            <div className="bg-[#F2EB18] sticky top-0 p-4 h-[70px] items-center w-full grid grid-cols-[1fr_20px] gap-2">
              <h2 className="line-clamp-1 flex text-text text-sm items-center gap-2 font-medium">
                <SheetClose>
                  <ArrowLeft size={20} />
                </SheetClose>
                4568741331342657987fsdfsdfsdfsdffsdfsdfsdfsdffsdfsdffsdfsdfsd
              </h2>

              <CircleQuestionMark color="#494949" size={20} />
            </div>
          </SheetHeader>
          <FormProvider {...methods}>
            <form
              className="p-4 h-full flex flex-col gap-5 justify-between overflow-auto pb-22"
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

                <Label className="text-text mt-3">Warehouse Signature</Label>
                <Image
                  src={"/auth-page-banner.png"}
                  alt={"Warehouse Signature"}
                  width={300}
                  height={250}
                  className="w-full h-[200px] object-cover bg-white border rounded-xl"
                />

                <Label className="text-text mt-3">Driver Signature</Label>
                <Image
                  src={"/auth-page-banner.png"}
                  alt={"Warehouse Signature"}
                  width={300}
                  height={250}
                  className="w-full h-[200px] object-cover bg-white border rounded-xl"
                />
                <Label className="text-text mt-3">Notes</Label>
                <p
                  className="w-full p-4 text-subtext text-sm max-h-[200px] object-cover bg-white border
                  rounded-xl"
                ></p>

                <Label className="text-text mt-3">Goods Images</Label>
                <Label className="text-text mt-3">POD Images</Label>
              </div>
            </form>
          </FormProvider>
          <div className="bg-background absolute bottom-0 inset-x-0 p-5 border-t border rounded-t-xl">
            <Button className="w-full" type="submit">
              Confirm Dispatch
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ReceiverProof;
