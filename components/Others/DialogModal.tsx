import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogModalProps } from "@/types/interface";
import Button from "./Button";
import { X } from "lucide-react";

const DialogModal: React.FC<DialogModalProps> = ({
  children,
  open,
  onOpenChange,
  className,
  dateTime,
  icon,
  title,
  name,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {!name ? (
          <button className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary">
            {icon}
          </button>
        ) : (
          <Button className={`rounded-lg md:rounded-full`}>
            {icon}
            <span className="hidden md:flex">{(name = title)}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-20px)] rounded-2xl sm:max-w-[700px] p-0 gap-0 bg-white">
        <DialogHeader className="border-b grid grid-cols-[1fr_1.5fr] w-full flex-row items-center justify-between bg-accent p-5 rounded-t-2xl">
          <DialogTitle className="text-base text-nowrap gap-5 font-medium text-fontPrimary">
            {title}
          </DialogTitle>
          {dateTime && (
            <DialogTitle className="text-base  gap-5 font-medium text-fontPrimary">
              {dateTime}
            </DialogTitle>
          )}
        </DialogHeader>
        <div className="p-5 max-h-[calc(100vh-300px)] overflow-auto ">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
