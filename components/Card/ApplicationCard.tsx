import apiClient from "@/lib/axiosInterceptor";
import { ApplicationCardProps } from "@/types/companyInterface";
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";

const ApplicationCard = forwardRef<HTMLDivElement, ApplicationCardProps>(
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
          `/admin/application/${data.id}`
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
        grid-cols-[20px_120px_120px_120px_150px_150px_150px_120px_120px_150px_150px_150px_150px_150px_150px]
        xl:grid-cols-[20px_1fr_1fr_1fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
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

        {/* Application ID */}
        <span className="text-subtext line-clamp-1">
          {data.id || "NA"}
        </span>

        {/* Job ID */}
        <span className="text-subtext line-clamp-1">
          {data.job_id || "NA"}
        </span>

        {/* Company ID */}
        <span className="text-subtext line-clamp-1">
          {data.company_id || "NA"}
        </span>

        {/* Candidate Name */}
        <span className="text-subtext font-medium line-clamp-1">
          {data.candidate_name || "NA"}
        </span>

        {/* Email */}
        <span className="text-subtext line-clamp-1">
          {data.email || "NA"}
        </span>

        {/* Phone */}
        <span className="text-subtext line-clamp-1">
          {data.phone || "NA"}
        </span>

        {/* Current CTC */}
        <span className="text-subtext line-clamp-1">
          {data.current_ctc || "NA"}
        </span>

        {/* Notice Period */}
        <span className="text-subtext line-clamp-1">
          {data.notice_period || "NA"}
        </span>

        {/* Status */}
        <span className="text-subtext line-clamp-1">
          {data.status || "NA"}
        </span>

        {/* Source */}
        <span className="text-subtext line-clamp-1">
          {data.source || "NA"}
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

ApplicationCard.displayName = "ApplicationCard";

export default ApplicationCard;
