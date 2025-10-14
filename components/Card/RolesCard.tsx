// components/Card/GroupCard.tsx
"use client";

import React, { forwardRef } from "react";

import { toast } from "sonner";
import apiClient from "@/lib/axiosInterceptor";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import { GroupCardProps } from "@/types/settingsinterface";

const RolesCard = forwardRef<HTMLDivElement, GroupCardProps>(
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
        className={`bg-background p-2 group w-max xl:w-full my-1 border grid items-center
        grid-cols-[20px_1.5fr_1fr_1fr_1fr] gap-4 ${
          isSelected
            ? "bg-secondary rounded-xl border-border"
            : "hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />
        <span className="text-subtext font-medium line-clamp-1">{data.group_name}</span>
        <span className="text-subtext text-sm line-clamp-1">{data.created_at?.split("T")[0] || "NA"}</span>
        <span className="text-subtext text-sm line-clamp-1">{data.updated_at?.split("T")[0] || "NA"}</span>
        <Actions id={data.id} onDelete={handleDelete} data={data} onUpdate={onUpdate} />
      </div>
    );
  }
);

RolesCard.displayName = "RolesCard";

export default RolesCard;
