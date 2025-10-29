// components/Card/GroupCard.tsx
"use client";

import React, { forwardRef } from "react";

import { toast } from "sonner";
import apiClient from "@/lib/axiosInterceptor";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import { GroupCardProps, RoleCardProps } from "@/types/settingsinterface";

const RolesCard = forwardRef<HTMLDivElement, RoleCardProps>(
  ({ data, isSelected = false, onCardSelect, onDelete, onUpdate }, ref) => {

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCardSelect(data.id, e.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/roles/${data.id}`);
        toast.success(response.data.message || "Deleted successfully!");
        onDelete(data.id);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete group");
      }
    };

    return (
      <div
        ref={ref}
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid 
          grid-cols-[20px_120px_120px_150px_150px_150px_150px_150px]
          lg:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
          xl:grid-cols-[20px_1fr_1fr_1fr_1fr] text-start
          
          gap-10 transition-all cursor-pointer items-center  ${
            isSelected
              ? "bg-secondary hover:bg-secondary border-border rounded-xl"
              : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
          }`}
      >
        <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />
        <span className="text-subtext font-medium line-clamp-1">{data.name}</span>
         <span className="text-subtext font-medium line-clamp-1">{data.code}</span>
        <span className="text-subtext text-sm line-clamp-1">{data.description?.split("T")[0] || "NA"}</span>
           {/* <span className="text-subtext font-medium line-clamp-1">{data.roleType}</span> */}
        
        <Actions id={data.id} onDelete={handleDelete} data={data} onUpdate={onUpdate} />
      </div>
    );
  }
);

RolesCard.displayName = "RolesCard";

export default RolesCard;
