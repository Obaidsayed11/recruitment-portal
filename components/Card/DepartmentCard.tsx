import apiClient from "@/lib/axiosInterceptor";
import { DepartmentCardProps,DepartmentProps } from "@/types/companyInterface";
import React, { forwardRef } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";

const DepartmentCard = forwardRef<HTMLDivElement, DepartmentCardProps>(
  ({ data, isSelected = false, onCardSelect, onDelete, onUpdate }, ref) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCardSelect(data.id, event.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/department/${data.id}`);
        console.log(response.data,"uqdqguedf")
        toast.success(response.data.message);
        onDelete(data.id);
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete department");
      }
    };

    return (
      <div
        ref={ref}
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap
          grid-cols-[20px_200px_150px_150px_150px_150px_100px]
          xl:grid-cols-[20px_1.5fr_1fr_1fr_1fr_1fr_1fr]
          gap-5 transition-all ease-linear border items-center ${
            isSelected
              ? "bg-secondary hover:bg-secondary border-border rounded-xl"
              : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
          }`}
      >
        {/* Checkbox */}
        <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />

        {/* Full Name */}
        <span className="text-subtext font-medium line-clamp-1">
          {data.name|| "NA"}
        </span>

        {/* Role / Head of Department */}
        <span className="text-subtext line-clamp-1">
          {data.description || "NA"}
        </span>

        
        {/* Actions */}
        <Actions id={data.id} onDelete={handleDelete} data={data} onUpdate={onUpdate} />
      </div>
    );
  }
);

DepartmentCard.displayName = "DepartmentCard";

export default DepartmentCard;
