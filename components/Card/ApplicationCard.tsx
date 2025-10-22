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
        const response = await apiClient.delete(`/admin/application/${data.id}`);
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
        grid-cols-[20px_160px_180px_120px_150px_250px_200px_150px_150px_150px_150px_150px_150px_150px_150px]
        xl:grid-cols-[20px_6fr_8fr_6fr_6fr_6fr_6fr_6fr_6fr_1.5fr_1fr_1fr_2fr_2fr_1fr_1fr_1fr_1fr]
        gap-5 transition-all ease-linear border items-center text-center  ${
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

        {/* Candidate Name */}
        <span className="text-subtext line-clamp-1">
          {data.candidateName || "NA"}
        </span>

        {/* Email */}
        <span className="text-subtext line-clamp-1">
          {data.email || "NA"}
        </span>

        {/* Phone */}
        <span className="text-subtext line-clamp-1">{data.phone || "NA"}</span>

        {/* Resume URL */}
        <span className="text-subtext font-medium line-clamp-1 ml-4">
          {data.resumeUrl ? (
            <a
              href={data.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Resume
            </a>
          ) : (
            "NA"
          )}
        </span>
<div className="text-subtext line-clamp-2">
  {data.experience && data.experience.length > 0 ? (
    <ul className="list-disc ml-4">
      {data.experience.map((exp, index) => (
        <li key={index}>
          {exp.role} @ {exp.company} ({exp.years} yrs)
        </li>
      ))}
    </ul>
  ) : (
    "NA"
  )}
</div>


        {/* Skills */}
        <span className="text-subtext line-clamp-1">
          {data.skills && data.skills.length > 0 ? data.skills.join(", ") : "NA"}
        </span>

        {/* Current CTC */}
        <span className="text-subtext line-clamp-1">
          {data.currentCTC || "NA"}
        </span>

        {/* Expected CTC */}
        <span className="text-subtext line-clamp-1">
          {data.expectedCTC || "NA"}
        </span>

        {/* Notice Period */}
        <span className="text-subtext line-clamp-1">
          {data.noticePeriod || "NA"}
        </span>

        {/* Status */}
        <span className="text-subtext line-clamp-1">{data.status || "NA"}</span>

        {/* Source */}
        <span className="text-subtext line-clamp-1">{data.source || "NA"}</span>

        {/* Created At */}
        <span className="text-subtext text-sm line-clamp-1">
          {data.createdAt ? data.createdAt.split("T")[0] : "NA"}
        </span>

        {/* Updated At */}
        <span className="text-subtext text-sm line-clamp-1">
          {data.updatedAt ? data.updatedAt.split("T")[0] : "NA"}
        </span>

        {/* Notes */}
        <span className="text-subtext line-clamp-1">
          {data.Notes 
            ? data.Notes.map((note) => note.note).join(", ")
            : "NA"}
        </span>

        {/* History */}
        <span className="text-subtext line-clamp-1">
          {data.History && data.History.length > 0
            ? data.History.map(
                (h) => `${h.oldStatus} → ${h.newStatus}`
              ).join(", ")
            : "NA"}
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
