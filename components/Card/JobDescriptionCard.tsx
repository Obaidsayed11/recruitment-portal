import apiClient from "@/lib/axiosInterceptor";
import { JobDescriptionCardProps } from "@/types/companyInterface";
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";

const JobDescriptionCard = forwardRef<HTMLDivElement, JobDescriptionCardProps>(
  ({ data, isSelected, onCardSelect, onDelete, onUpdate }, ref) => {
    const router = useRouter();

    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      onCardSelect(data.id, event.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(
          `/admin/jobdescription/${data.id}`
        );
        toast.success(response.data.message);
        onDelete(data.id);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    return (
      <div
        ref={ref}
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap
        grid-cols-[20px_120px_120px_150px_150px_150px_150px_150px_250px_250px_250px_120px_100px_100px_150px_150px]
        xl:grid-cols-[20px_1fr_1fr_1.5fr_1fr_1fr_1fr_2fr_2fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr]
        gap-5 transition-all ease-linear border items-center ${
          isSelected
            ? "bg-secondary hover:bg-secondary border-border rounded-xl"
            : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        {/* Checkbox */}
        <CheckBox
          checked={isSelected}
          handleCheckboxChange={handleCheckboxChange}
        />

        {/* Job ID */}
        <span className="text-subtext line-clamp-1">
          {data.id|| "NA"}
        </span>

        {/* Company ID */}
        <span className="text-subtext line-clamp-1">
          {data.company_id || "NA"}
        </span>

        {/* Job Title */}
        <span className="text-subtext font-medium line-clamp-1">
          {data.job_title || "NA"}
        </span>

        {/* Department */}
        <span className="text-subtext line-clamp-1">
          {data.department || "NA"}
        </span>

        {/* Location */}
        <span className="text-subtext line-clamp-1">
          {data.location || "NA"}
        </span>

        {/* Experience Required */}
        <span className="text-subtext line-clamp-1">
          {data.experience_required || "NA"}
        </span>

        {/* Salary Range */}
        <span className="text-subtext line-clamp-1">
          {data.salary_range || "NA"}
        </span>

        {/* Employment Type */}
        <span className="text-subtext line-clamp-1">
          {data.employment_type || "NA"}
        </span>

        {/* Description */}
        <span className="text-subtext line-clamp-2 text-wrap">
          {data.description || "NA"}
        </span>

        {/* Responsibilities */}
        <span className="text-subtext line-clamp-2 text-wrap">
          {data.responsibilities || "NA"}
        </span>

        {/* Requirements */}
        <span className="text-subtext line-clamp-2 text-wrap">
          {data.requirements || "NA"}
        </span>

        {/* Created By */}
        <span className="text-subtext line-clamp-1">
          {data.created_by || "NA"}
        </span>

        {/* Published */}
        <span className="text-subtext line-clamp-1">
          {data.published ? "Yes" : "No"}
        </span>

        {/* Status */}
        <span className="text-subtext line-clamp-1">
          {data.status || "NA"}
        </span>

        {/* Created At */}
        <span className="text-subtext text-sm line-clamp-1">
          {data.created_at ? data.created_at.split("T")[0] : "NA"}
        </span>

        {/* Updated At */}
        <span className="text-subtext text-sm line-clamp-1">
          {data.updated_at ? data.updated_at.split("T")[0] : "NA"}
        </span>

        {/* Actions */}
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

JobDescriptionCard.displayName = "JobDescriptionCard";

export default JobDescriptionCard;
