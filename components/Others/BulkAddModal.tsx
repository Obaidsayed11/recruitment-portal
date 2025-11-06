// src/components/Modals/BulkAddModal.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AiOutlinePlus } from "react-icons/ai";
import BulkAddStaff from "./BulkAddStaff";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

// FIX: Define props to accept the handler from the parent page
interface BulkAddModalProps {
  onUploadComplete: (data: any[]) => void;
  downloadFileUrl: string;
  uploadType:
    | "company"
    | "user"
    | "department"
    | "job"
    | "application"
    | "roles"
    // | "support-agents"
    // | "support-managers";
}

const BulkAddModal: React.FC<BulkAddModalProps> = ({
  onUploadComplete,
  uploadType,
  downloadFileUrl,
}) => {
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // This function now correctly uses the prop to pass data up and close the modal
  const handleSuccessfulUpload = (data: any[]) => {
    onUploadComplete(data); // Pass data to the parent page
    setIsBulkModalOpen(false); // Close the modal
  };

  return (
    <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
      <DialogTrigger asChild>
        <button className="text-white bg-primary cursor-pointer text-nowrap py-2 px-4 text-base  justify-center transform transition-all duration-300 ease-in-out flex h-full items-center gap-3 rounded-full">
          <Plus size={24} /> Bulk Add
        </button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-20px)] sm:w-full rounded-xl p-4 pt-10">
        <BulkAddStaff
          close={() => setIsBulkModalOpen(false)}
          onBulkUpload={handleSuccessfulUpload}
          uploadType={uploadType}
          downloadFileUrl={downloadFileUrl}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BulkAddModal;
