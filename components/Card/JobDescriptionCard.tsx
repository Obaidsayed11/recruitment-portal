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
        grid-cols-[20px_120px_120px_150px_150px_150px_150px_150px_250px_250px_250px_120px_100px]
        xl:grid-cols-[20px_1fr_1fr_1.5fr_1fr_1.5fr_2fr_2fr_2fr_2fr_1fr_1fr_1fr]
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
        {/* <span className="text-subtext line-clamp-1">
          {data.id|| "NA"}
        </span> */}

        {/* Company ID */}
        {/* <span className="text-subtext line-clamp-1">
          {data.companyId|| "NA"}
        </span> */}

        {/* Job Title */}
        <span className="text-subtext font-medium line-clamp-1">
          {data.title || "NA"}
        </span>
        {/* Location */}
        <span className="text-subtext line-clamp-1">
          {data.location || "NA"}
        </span>

        {/* Experience Required */}
        <span className="text-subtext line-clamp-1">
          {data.experience || "NA"}
        </span>
        {/* Salary Range */}
        <span className="text-subtext line-clamp-1">
          {data.salaryRange || "NA"}
        </span>

        {/* Department */}
        <span className="text-subtext line-clamp-1">
          {data.Department.name || "NA"}
        </span>



        {/* Employment Type */}
        <span className="text-subtext line-clamp-1">
          {data.employmentType || "NA"}
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
        {/* <span className="text-subtext line-clamp-1">
          {data.created_by || "NA"}
        </span> */}

        {/* Published */}
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
        {/* Status */}
        <span className="text-subtext line-clamp-1">
          {data.status || "NA"}
        </span>

        {/* Created At */}
        {/* <span className="text-subtext text-sm line-clamp-1">
          {data.createdAt ? data.createdAt.split("T")[0] : "NA"}
        </span> */}

        {/* Updated At */}
        {/* <span className="text-subtext text-sm line-clamp-1">
          {data.updatedAt ? data.updatedAt.split("T")[0] : "NA"}
        </span> */}

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
