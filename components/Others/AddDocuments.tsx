import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import Compressor from "compressorjs";
import { ImageIcon } from "lucide-react";

interface AddDocumentProps {
  onDocumentUpload: any;
  title: string;
  existingDocumentUrl?: string | null; // Prop to receive existing preview URL from the parent
}

const AddDocument: React.FC<AddDocumentProps> = ({
  onDocumentUpload,
  existingDocumentUrl = null,
  title,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingDocumentUrl
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const droppedFile = acceptedFiles[0];

        if (droppedFile.size > 5 * 1024 * 1024) {
          setErrorMessage("Max size 5 MB.");
          return;
        }

        new Compressor(droppedFile, {
          quality: 0.6,
          maxWidth: 800,
          maxHeight: 800,
          convertSize: 0,
          success: (compressedFile) => {
            const webpFile = new File(
              [compressedFile],
              `${droppedFile.name.split(".")[0]}.webp`,
              { type: "image/webp" }
            );

            setFile(webpFile);
            const url = URL.createObjectURL(webpFile);
            setPreviewUrl(url); // Update the preview URL
            setErrorMessage(null);
            onDocumentUpload(webpFile); // Pass the WebP image to the parent
          },
          error: (err) => {
            console.error("Compression error:", err);
            setErrorMessage("Image compression failed. Please try again.");
          },
        });
      }
    },
  });

  // Synchronize with `existingDocumentUrl` if it changes
  useEffect(() => {
    if (existingDocumentUrl && existingDocumentUrl !== previewUrl) {
      setPreviewUrl(existingDocumentUrl);
    }
  }, [existingDocumentUrl, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      {...getRootProps()}
      className="flex flex-col col-span-2 items-center border border-dashed border-[#848484] rounded-lg py-1 w-full px-4 justify-center gap-2 cursor-pointer"
    >
      <input {...getInputProps()} />
      <label className="text-sm font-normal mb-1">{title}</label>

      {previewUrl ? (
        <Image
          src={previewUrl}
          className="w-[400px] h-[200px] object-contain"
          alt="Preview"
          width={100}
          height={100}
        />
      ) : (
        <ImageIcon color="#163298" />
      )}
      {errorMessage ? (
        <p className="text-red-500 text-xs">{errorMessage}</p>
      ) : (
        <p className="text-xs text-fontSecondary">
          Drop an image here or
          <span className="font-medium text-center block underline cursor-pointer">
            Upload
          </span>
        </p>
      )}
    </div>
  );
};

export default AddDocument;
