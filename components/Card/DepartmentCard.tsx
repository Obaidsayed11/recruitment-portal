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
        const response = await apiClient.delete(`/admin/department/${data.id}`);
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
          {data.department_name || "NA"}
        </span>

        {/* Role / Head of Department */}
        <span className="text-subtext line-clamp-1">
          {data.head_of_department || "NA"}
        </span>

        {/* Phone */}
        <span className="text-subtext line-clamp-1">{data.phone || "NA"}</span>

        {/* Email */}
        <span className="text-subtext line-clamp-1">{data.email || "NA"}</span>

        {/* Created At */}
        <span className="text-subtext text-sm line-clamp-1">
          {data.created_at ? data.created_at.split("T")[0] : "NA"}
        </span>

        {/* Updated At */}
        <span className="text-subtext text-sm line-clamp-1">
          {data.updated_at ? data.updated_at.split("T")[0] : "NA"}
        </span>

        {/* Actions */}
        <Actions id={data.id} onDelete={handleDelete} data={data} onUpdate={onUpdate} />
      </div>
    );
  }
);

DepartmentCard.displayName = "DepartmentCard";

export default DepartmentCard;
