import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
} from "react";
import Image from "next/image";
import { FormLabel } from "../ui/form";

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void; // Callback to send selected image to the parent
  previewSize?: string;
  label?: string;
}

export interface ImageUploaderHandle {
  clearImagePreview: () => void;
}

const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
  ({ onImageSelect, label, previewSize = "w-[120px] h-[120px]" }, ref) => {
    const [image, setImage] = useState<File | null>(null);

    // Expose clearImagePreview method to parent via ref
    useImperativeHandle(ref, () => ({
      clearImagePreview: () => {
        setImage(null); // Clear the preview
        onImageSelect(null); // Notify parent about the cleared image
      },
    }));

    const handleImagePreview = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file); // Set the image locally for previewf
        onImageSelect(file); // Send the selected file to the parent
      }
    };

    return (
      <div className="gap-3 grid">
        <FormLabel className=" text-fontPrimary">{label}</FormLabel>
        <div className={` relative  ${previewSize}`}>
          {image ? (
            <Image
              src={URL.createObjectURL(image)} // Create a preview URL for the file
              alt="Selected Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          ) : (
            <div className="absolute top-0 left-0 flex items-center justify-center p-0 w-[120px] h-[120px] rounded-lg border-1 outline-dashed outline-primary outline-2">
              <span className="text-primary text-sm">Upload Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagePreview}
            className="absolute inset-0 w-[120px] h-[120px] opacity-0 cursor-pointer"
          />
        </div>
      </div>
    );
  }
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;
