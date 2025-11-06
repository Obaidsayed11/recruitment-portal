// UploadFileModal.tsx
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

interface UploadFileModalProps {
  file: File;
  close: () => void;
  handleFileUpload: () => void;
  isUploading: boolean;
  uploadProgress: number;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({
  file,
  close,
  handleFileUpload,
  isUploading,
  uploadProgress,
}) => {
  const formatFileSize = (size: number) => {
    return size > 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;
  };

  const getFileImageSrc = () => {
    // FIX: Added 'text/csv' for consistency
    if (file.type === "text/csv") {
      return "/file.png"; // Or a specific CSV icon if you have one
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return "/file.png";
    }
    return "/default.png"; // Fallback icon
  };

  return (
    <>
      <h2 className="text-primary text-lg font-medium">Upload File</h2>

      <div className="flex gap-4 items-center bg-secondary p-4 rounded-xl">
        <Image
          src={getFileImageSrc()}
          alt="File type icon"
          width={38}
          height={50}
          className="shrink-0"
        />
        <div className="w-full overflow-hidden">
          <div className="flex justify-between items-center w-full">
            <h3
              className="text-base text-fontPrimary truncate pr-2"
              title={file.name}
            >
              {file.name}
            </h3>
            <span className="text-sm text-fontSecondary whitespace-nowrap">
              {formatFileSize(file.size)}
            </span>
          </div>

          {/* IMPROVEMENT: Switched to a div-based progress bar for better styling */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="text-sm text-fontSecondary mt-1 block">
            {isUploading
              ? `Uploading... ${uploadProgress}%`
              : uploadProgress === 100
              ? "Upload Complete!"
              : "Ready to upload"}
          </span>
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        {isUploading ? (
          <Button
            className="px-6 py-2 bg-gray-400 text-white rounded-full cursor-not-allowed"
            disabled
          >
            Uploading...
          </Button>
        ) : (
          <>
            <Button
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              className="px-6 py-2 bg-primary rounded-full text-white hover:bg-blue-700"
              // FIX: Removed the `close()` call from here.
              // It should only be called by the parent component after the upload completes.
              onClick={handleFileUpload}
            >
              Upload
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default UploadFileModal;
