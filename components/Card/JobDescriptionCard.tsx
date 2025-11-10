  import apiClient from "@/lib/axiosInterceptor";
  import { JobDescriptionCardProps } from "@/types/companyInterface";
  import { useParams, useRouter } from "next/navigation";
  import React, { forwardRef } from "react";
  import { toast } from "sonner";
  import CheckBox from "../Others/CheckBox";
  import Actions from "../Others/Actions";
  import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "../PermissionContext";

  const JobDescriptionCard = forwardRef<HTMLDivElement, JobDescriptionCardProps>(
    ({ data, isSelected, onCardSelect, onDelete, onUpdate }, ref) => {
      const router = useRouter();
       const { permissions } = usePermissions();
    
    const params = useParams() as { companyId: string };
    const companyId = params.companyId;
      const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
         event.stopPropagation();
        onCardSelect(data.id, event.target.checked);
      };

      const handleDelete = async () => {
        try {
          const response = await apiClient.delete(
            `/job/${data.id}`
          );
          toast.success(response.data.message);
          
          onDelete(data.id);
        } catch (error: any) {
          toast.error(error.message);
        }
      };
  // its is the handler for each detail whole dataa
      const handleRowClick = () => {
       
        router.push(`/companies/${companyId}/t/jobs/view-jobs/${data.id}`);
          toast.error("You do not have permission to view single job description.");
      };
      const stripHtml = (html: string = "") =>
      html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();


  return (
        <div
          ref={ref}
          onClick={handleRowClick} // this is the click handlerr
          className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid 
          grid-cols-[20px_120px_120px_150px_150px_150px_150px_100px]

          md:grid-cols-[10px_150px_160px_115px_130px_110px_80px_40px]
          lg:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
          xl:grid-cols-[0px_0.9fr_0.9fr_0.9fr_0.9fr_0.9fr_1fr_1fr]
          
          gap-10 transition-all cursor-pointer items-center  ${
            isSelected
              ? "bg-secondary hover:bg-secondary border-border rounded-xl"
              : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
          }`}
        >
          {/* Checkbox (1st column) */}
          <div onClick={(e) => e.stopPropagation()}>
          <CheckBox
        
            checked={isSelected}
            handleCheckboxChange={handleCheckboxChange}
          />
          </div>

          {/* Job Title (2nd column) */}
          <span className="text-subtext font-medium line-clamp-1 text-left truncate overflow-hidden xl:truncate lg:truncate ">
            {data.description || "NA"}
            <span className="text-sm line-clamp-6 text-left">
            {data.location || "NA"}
          </span>
          </span>
          {/* Location (3rd column) */}
          {/* <span className="text-subtext line-clamp-6 text-left ml-[-20]">
            {data.location || "NA"}
          </span> */}

          {/* Experience Required (4th column) */}
          <span className="text-subtext line-clamp-1 text-left">
            {data.experience || "NA"}
            <span className="text-sm line-clamp-1 text-left">
            {data.salaryRange || "NA"}
          </span>
          </span>
          {/* Salary Range (5th column) */}
          {/* <span className="text-subtext line-clamp-1 text-left">
            {data.salaryRange || "NA"}
          </span> */}

          {/* Department (6th column) */}
          <span className="text-subtext line-clamp-1 text-left">
            {data.Department?.name || "NA"}
          </span>

          {/* Employment Type (7th column) */}
          <span className="text-subtext line-clamp-1 text-left">
            {data?.employmentType?.split("_").join(" ") || "NA"}
          </span>

          {/* Description (8th column) */}
          {/* <span className="text-xs line-clamp-2 text-wrap text-left ml-10">
            {data.description || "NA"}
          </span> */}

          {/* Responsibilities (9th column) */}
          {/* <span className="text-subtext line-clamp-2 text-wrap text-left ml-[-12]">
            {data.responsibilities || "NA"}
          </span> */}

          {/* Requirements (10th column) */}
          {/* <span className="text-subtext line-clamp-2 text-wrap text-left ">
            {data.requirements || "NA"}
          </span> */}

          {/* Published (11th column) */}
          <span className="text-subtext text-left">
    {data.published !== undefined ? (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium min-w-[100px] inline-block text-center ${
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
          <span className="text-subtext line-clamp-1 text-left ">
            {data.status || "NA"}
          </span>

          {/* Actions (13th column - final column) */}
          < div onClick={(e) => e.stopPropagation()}>
          <Actions
          
            id={data.id}
            onDelete={handleDelete}
            data={data}
            onUpdate={onUpdate}
            permissions={permissions}
          />
          </div>
        </div>
      );
    }
  );

  JobDescriptionCard.displayName = "JobDescriptionCard";

  export default JobDescriptionCard;
