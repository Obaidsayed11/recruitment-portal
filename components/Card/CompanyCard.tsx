import apiClient from "@/lib/axiosInterceptor";
import { CompanyCardProps } from "@/types/companyInterface";
import React, { forwardRef } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";

const CompanyCard = forwardRef<HTMLDivElement, CompanyCardProps>(
  ({ data, isSelected, onCardSelect, onDelete, onUpdate }, ref) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCardSelect(data.id, event.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/company/${data.id}`);
        toast.success(response.data.message);
        onDelete(data.id);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    return (
      <div
        ref={ref}
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid grid-cols-[20px_1.5fr_1fr_1fr_2fr_1fr] gap-5 items-center ${
          isSelected
            ? "bg-secondary hover:bg-secondary border-border rounded-xl"
            : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />
        <span className="font-medium text-text line-clamp-2">{data.name || "NA"}</span>
        <span className="text-subtext line-clamp-1">{data.websiteUrl || "NA"}</span>
        <span className="text-subtext line-clamp-1">{data.careerPageUrl || "NA"}</span>
        <span className="text-subtext line-clamp-2">{data.description || "NA"}</span>
        <Actions
          id={data.id}
          onDelete={handleDelete}
          data={data}
          onUpdate={onUpdate}
        />
      </div>
    );
  }
);

CompanyCard.displayName = "CompanyCard";

export default CompanyCard;
