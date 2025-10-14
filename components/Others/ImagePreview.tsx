import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
} from "react";
import Image from "next/image";
import { BASE_URL } from "@/config";

interface ImagePreviewProps {
  imageType?: "profile" | "logo";
  previewSize?: string;
  firstName: string;
  lastName: string;
  initialImage: string | File | null; // Allow null in addition to string and File
  setImage?: React.Dispatch<React.SetStateAction<string | File | null>>; // Add setImage function here
}

export interface ImagePreviewHandle {
  handleImagePreview: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImagePreview: () => void;
}

const ImagePreview = forwardRef<ImagePreviewHandle, ImagePreviewProps>(
  (
    {
      imageType = "profile",
      previewSize = "w-[90px] h-[90px]",
      firstName,
      lastName,
      initialImage,
      setImage,
    },
    ref
  ) => {
    // Local state for image preview
    const [image, setLocalImage] = useState<string | File | null>(
      initialImage || null
    );

    // Exposing methods for handling image uploads and removals
    useImperativeHandle(ref, () => ({
      handleImagePreview: (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setLocalImage(reader.result as string); // Set the new image in local state
            if (setImage) setImage(file); // Update the parent state with the new file
          };
          reader.readAsDataURL(file);
        }
      },
      removeImagePreview: () => {
        // Only reset the image if it was explicitly removed by the user
        setLocalImage(null); // Reset the preview if the image is explicitly removed
        if (setImage) setImage(null); // Clear the parent state
      },
    }));

    // Helper function to decide which image source to use
    const getImageSource = () => {
      if (typeof image === "string") {
        if (image.startsWith("data:")) {
          // It's a base64 image, return it as is
          return image;
        } else {
          // It's a regular URL, prepend the base URL
          return `${BASE_URL}${image}`;
        }
      }
      if (image instanceof File) {
        // It's a file, so create a temporary object URL
        return URL.createObjectURL(image);
      }
      return ""; // Fallback to empty string if no image
    };

    return (
      <div className={`relative ${previewSize}`}>
        {image ? (
          <Image
            className="rounded-full"
            alt="Profile Image"
            src={getImageSource()} // Use the correct image source here
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-300 rounded-full">
            <span className="text-white text-4xl">{`${firstName[0]}${
              lastName[0] === undefined || null ? "" : lastName[0]
            }`}</span>
          </div>
        )}
      </div>
    );
  }
);

ImagePreview.displayName = "ImagePreview";

export default ImagePreview;
