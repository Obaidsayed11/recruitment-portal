
import React from "react";
import Image from "next/image";
import { BACKEND_URL } from "@/config";
import { ClientProps } from "@/types/interface";

interface ClientInfoSectionProps {
  clientData: ClientProps | null; // Replace 'any' with the specific type of your clientData object for better type safety
  handleUpdate: (updatedData: any) => void;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  clientData,
  handleUpdate,
}) => {
  return (
    <section className="p-3 bg-secondary border rounded-xl grid 2xl:grid-cols-3 items-center md:grid-cols-2 gap-5">
      <div className="flex sm:flex-row flex-wrap flex-col gap-[10px] sm:items-center">
        {clientData?.logo ? (
          <Image
            src={`${BACKEND_URL}${clientData?.logo}`}
            alt={clientData?.name}
            width={180}
            height={100}
            loading="eager"
            className="rounded-xl border object-contain bg-white w-[150px] h-[100px]"
          />
        ) : (
          <div className="rounded-lg w-[150px] h-[100px] bg-gray-400 flex items-center justify-center text-white font-bold text-xl">
            {clientData?.name.charAt(0).toUpperCase() || "NA"}
          </div>
        )}
        <div className="flex flex-col gap-[10px]">
          <p className="text-lg font-medium text-text">
            {clientData?.name || "NA"}
          </p>

          {clientData?.website && (
            <div className="flex gap-2">
              <p className="text-text">Website: </p>
              <span className="text-text line-clamp-1 flex items-center gap-2 text-sm">
                {clientData?.website || "NA"}
              </span>
            </div>
          )}
          <span className="text-text line-clamp-1 flex items-center gap-2 text-sm">
            {clientData?.code || "NA"}
          </span>
        </div>
      </div>

      {/* <div className="flex flex-col gap-[10px] border-l-[#A8A8A8] border-l pl-5">
        <span className="text-text line-clamp-1 flex items-center gap-2 text-sm">
          {clientData?.phone || "NA"}
        </span>
        <span className="text-text line-clamp-1 flex items-center gap-2 text-sm">
          {clientData?.email || "NA"}
        </span>
      </div> */}
      <div className="flex flex-col">
        <span className="text-text text-sm line-clamp-1">
          <strong className="font-medium">Address: </strong>
          {clientData?.address || "NA"}
        </span>
        <span className="text-text text-sm line-clamp-1">
          <strong className="font-medium">Country: </strong>
          {clientData?.country || "NA"}
        </span>
        <span className="text-text text-sm line-clamp-1">
          <strong className="font-medium">Industry: </strong>
          {clientData?.industry || "NA"}
        </span>
      </div>
      <div className="flex flex-col gap-[10px] border-l-[#A8A8A8] border-l pl-5">
        <span className="text-text text-sm line-clamp-1">
          <strong className="font-medium">Created At: </strong>
          {clientData?.createdAt ? clientData?.createdAt.slice(0, 10) : "NA"}
        </span>
        <span className="text-text text-sm line-clamp-1">
          <strong className="font-medium">Updated At: </strong>
          {clientData?.updatedAt ? clientData?.updatedAt.slice(0, 10) : "NA"}
        </span>
      </div>
    </section>
  );
};

export default ClientInfoSection;

