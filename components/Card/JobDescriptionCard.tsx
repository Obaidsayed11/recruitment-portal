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
        className={`bg-background p-2 group w-full xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap
        /* 1. Explicitly match the column widths (20px checkbox + 12 content + 1 Action = 14 columns) */
        grid-cols-[20px_120px_120px_150px_150px_150px_150px_150px_250px_250px_250px_120px_100px_1fr]

        /* 2. Match the XL definition using '4fr' for content and '1fr' for actions */
        xl:grid-cols-[20px_4fr_4fr_4fr_4fr_4fr_4fr_4fr_4fr_4fr_4fr_4fr_4fr_1fr]
        
        gap-10 transition-all ease-linear border items-center  ${
          isSelected
            ? "bg-secondary hover:bg-secondary border-border rounded-xl"
            : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        {/* Checkbox (1st column) */}
        <CheckBox
          checked={isSelected}
          handleCheckboxChange={handleCheckboxChange}
        />

        {/* Job Title (2nd column) */}
        <span className="text-subtext font-medium line-clamp-1">
          {data.title || "NA"}
        </span>
        {/* Location (3rd column) */}
        <span className="text-subtext line-clamp-1">
          {data.location || "NA"}
        </span>

        {/* Experience Required (4th column) */}
        <span className="text-subtext line-clamp-1">
          {data.experience || "NA"}
        </span>
        {/* Salary Range (5th column) */}
        <span className="text-subtext line-clamp-1">
          {data.salaryRange || "NA"}
        </span>

        {/* Department (6th column) */}
        <span className="text-subtext line-clamp-1">
          {data.Department?.name || "NA"}
        </span>

        {/* Employment Type (7th column) */}
        <span className="text-subtext line-clamp-1">
          {data.employmentType || "NA"}
        </span>

        {/* Description (8th column) */}
        <span className="text-xs line-clamp-2 text-wrap">
          {data.description || "NA"}
        </span>

        {/* Responsibilities (9th column) */}
        <span className="text-subtext line-clamp-2 text-wrap">
          {data.responsibilities || "NA"}
        </span>

        {/* Requirements (10th column) */}
        <span className="text-subtext line-clamp-2 text-wrap">
          {data.requirements || "NA"}
        </span>

        {/* Published (11th column) */}
         <span className="text-subtext">
          {data.published !== undefined ? (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.published
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {data.published ? "Yes" : "No"}
            </span>
          ) : (
            "NA"
          )}
        </span>
        {/* Status (12th column) */}
        <span className="text-subtext line-clamp-1">
          {data.status || "NA"}
        </span>

        {/* Actions (13th column - final column) */}
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
