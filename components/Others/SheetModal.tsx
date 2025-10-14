import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SheetModalProps } from "@/types/interface";
import Button from "./Button";

const SheetModal: React.FC<SheetModalProps> = ({
  children,
  open,
  onOpenChange,
  className,
  className2,
  dateTime,
  icon,
  title,
  name,
}) => {
  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetTrigger className="w-full">
          {!name ? (
            <button className="rounded-md w-full gap-2 transition-all flex items-center ease-linear text-primary group-hover:text-white cursor-pointer">
              {icon} Edit
            </button>
          ) : (
            <Button
              className={`rounded-lg md:rounded-full  cursor-pointer ${className2}`}
            >
              {icon}
              <span className="hidden lg:flex">{(name = title)}</span>
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          className={`w-[calc(100vw-20px)] ${className} p-0 gap-0 bg-white`}
        >
          <SheetHeader className="border-b grid grid-cols-[1fr_1.5fr] w-full flex-row items-center justify-between bg-[#E8F5ED] p-5 rounded-t-2xl">
            <SheetTitle className="text-base  gap-5 font-medium text-fontPrimary text-start">
              {title}
            </SheetTitle>
          </SheetHeader>
          <div className="p-2 md:p-5 max-h-[calc(100vh-80px)] overflow-auto ">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetModal;
