import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Button from "@/components/Others/Button";
import Image from "next/image";
import { Save, UploadCloud } from "lucide-react";
import AddDocument from "@/components/Others/AddDocuments";

export interface UploadDocumentProps {
  setDocument:
    | Dispatch<SetStateAction<File | null>>
    | ((document: File) => void);
  documentUrl: string | null;
  title: string;
  className?: string;
}
const UploadAndViewDocument: React.FC<UploadDocumentProps> = ({
  setDocument,
  documentUrl,
  title,
  className,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(!documentUrl);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleDocumentUpload = (file: File) => {
    if (typeof setDocument === "function") {
      setDocument(file); // Call the function directly
    }
  };

  const handleSave = () => {
    setIsEditing(false); // Exit edit mode
    setIsPopoverOpen(false); // Close the Popover
  };

  const handleUploadNew = () => {
    setIsEditing(true); // Enter edit mode
    if (typeof setDocument === "function") {
      setDocument(null as unknown as File); // Clear the document if needed
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger
        className={`bg-blue-100 rounded-lg py-2 px-4 self-end  text-primary h-fit text-nowrap ${className}`}
      >
        {title}
      </PopoverTrigger>

      <PopoverContent align="end" className="h-full">
        {isEditing ? (
          <>
            <AddDocument
              onDocumentUpload={(file: File) => {
                setDocument(file); // Lift the uploaded document to the parent
                setIsEditing(false); // Exit edit mode
              }}
              existingDocumentUrl={documentUrl}
              title={title}
            />
          </>
        ) : (
          <>
            <Image
              src={`${documentUrl || "/"}`}
              width={200}
              height={200}
              alt={title}
              className="mx-auto border rounded-xl p-2 bg-white"
            />
            <div className="flex gap-2 mt-2 justify-between">
              <button
                onClick={handleUploadNew}
                className="bg-secondary flex items-center gap-2 text-fontSecondary px-3 text-sm rounded-full border"
              >
                <UploadCloud size={15} /> Upload New
              </button>
              <Button
                icon={<Save size={15} />}
                onClick={handleSave}
                className="rounded-full text-sm"
              >
                Save
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UploadAndViewDocument;
