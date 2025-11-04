// components/Card/GroupCard.tsx
"use client";

import React, { forwardRef } from "react";

import { toast } from "sonner";
import apiClient from "@/lib/axiosInterceptor";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import { GroupCardProps } from "@/types/settingsinterface";

const GroupCard = forwardRef<HTMLDivElement, GroupCardProps>(
  ({ data, isSelected = false, onCardSelect, onDelete, onUpdate }, ref) => {

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCardSelect(data.id, e.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/groups/${data.id}`);
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
          grid-cols-[20px_120px_120px_120px_120px_150px]
          lg:grid-cols-[40px_1fr_1fr_1fr_1fr]
          xl:grid-cols-[0px_1fr_1fr_1fr_1fr]
          
          gap-10 transition-all cursor-pointer items-center text-left ${
            isSelected
              ? "bg-secondary hover:bg-secondary border-border rounded-xl"
              : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
          }`}
      >
          <div onClick={(e) => e.stopPropagation()}>

        <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />
          </div>
        <span className="text-subtext font-medium line-clamp-1">{data.name}</span>
        <span className="text-subtext font-medium line-clamp-1">
  {new Date(data.createdAt).toLocaleString()}
</span>
<span className="text-subtext font-medium line-clamp-1">
  {new Date(data.updatedAt).toLocaleString()}
</span>

        
   
        <Actions id={data.id} onDelete={handleDelete} data={data} onUpdate={onUpdate} />
      </div>
    );
  }
);

GroupCard.displayName = "GroupCard";

export default GroupCard;
