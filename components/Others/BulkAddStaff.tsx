// src/components/BulkAddStaff.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import apiClient from "@/lib/axiosInterceptor";
import UploadFileModal from "../UploadFileModal";
// import { BulkUploadResponse } from "@/types/interface";

export interface BulkUploadResponse<T> {
  message: string;
  users: T[];
  data: T[];
  invalid: Array<{
    row: number;
    errors: string[];
  }>;
}


// This component is already correct and does not need changes.
interface BulkAddStaffProps {
  close: () => void;
  onBulkUpload: (data: any[]) => void;
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

const BulkAddStaff = <T,>({
  close,
  onBulkUpload,
  downloadFileUrl,
  uploadType,
}: BulkAddStaffProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [currentModal, setCurrentModal] = useState<"upload" | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadFileUrl;
    link.download = `${uploadType}_template.xlsx`;
    link.click();
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const apiEndpoint = `/${uploadType}/import`;

    



    const formData = new FormData();
    formData.append("file", file);
    setUploadProgress(0);
    setIsUploading(true);
    try {
      const response = await apiClient.post<BulkUploadResponse<T>>(
        apiEndpoint,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total) {
              setUploadProgress(Math.floor((loaded * 100) / total));
            }
          },
        }
      );
      console.log("*****Bulk*******", response);
      if (response.status === 200 || response.status === 201) {
        onBulkUpload(response.data.data || []);
        if (response.data.data.length !== 0) {
          toast.success(response.data.message);
        }
        response.data.invalid?.forEach((item: any) => {
          const errorMessages = item.errors
            .map((err: any) => `- ${err}`)
            .join("\n");
          toast.error(`Error in row ${item.row}:\n${errorMessages}`, {
            duration: 10000,
          });
        });
        handleClose();
      } else {
        setErrorMessage("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      setErrorMessage(serverMessage);
      toast.error(serverMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setCurrentModal("upload");
        setErrorMessage(null);
      } else {
        toast.error("Invalid file or file is too large.");
      }
    },
  });

  const handleClose = () => {
    setCurrentModal(null);
    setFile(null);
    setErrorMessage(null);
    close();
  };

  return (
    <>
      {currentModal === "upload" && file && (
        <UploadFileModal
          file={file}
          close={handleClose}
          handleFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      )}
      {currentModal === null && (
        <>
          <div className="flex gap-4 justify-between items-center bg-secondary p-2 rounded-xl mb-1">
            <div className="flex gap-2 items-center">
              <Image src={"/file.png"} alt="File" width={38} height={50} />
              <div className="grid content-center">
                <h2 className="text-base sm:text-lg text-fontPrimary leading-4">
                  Bulk Upload Template.xlsx
                </h2>
                <p className="text-fontSecondary text-xs sm:text-sm">
                  Start by downloading the template
                </p>
              </div>
            </div>
            <Image
              src={"/download.png"}
              alt="Download File"
              className="w-[20px] h-[25px] cursor-pointer"
              width={50}
              height={50}
              onClick={handleDownload}
            />
          </div>
          <hr className="h-0.5 bg-primary" />
          <div
            {...getRootProps()}
            className={`flex flex-col items-center outline-1 rounded-xl outline-dashed py-8 px-4 justify-center gap-1 cursor-pointer mt-2 ${
              isDragActive ? "bg-gray-100" : ""
            }`}
          >
            <input {...getInputProps()} />
            <Image
              src={"/file.png"}
              className="w-[38px] h-[50px] object-contain"
              alt="File"
              width={100}
              height={100}
            />
            <p>Drop file here or upload</p>
          </div>
          <div className="flex justify-between text-xs sm:text-base">
            <p className="text-fontPrimary">Supported formats: .xlsx</p>
            <p className="text-fontPrimary">Max Size: 2 MB</p>
          </div>
        </>
      )}
    </>
  );
};

export default BulkAddStaff;
