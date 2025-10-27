import apiClient from "@/lib/axiosInterceptor";
import { ApplicationCardProps } from "@/types/companyInterface";
import { useRouter } from "next/navigation";
import React, { forwardRef, useState } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";

const ApplicationCard = forwardRef<HTMLDivElement, ApplicationCardProps>(
  ({ data, isSelected, onCardSelect, onDelete, onUpdate }, ref) => {
    const router = useRouter();
       const [isDialogOpen, setIsDialogOpen] = useState(false);

    const  ApplicationStatus  = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED"
    ]


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
         className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid 
          grid-cols-[20px_120px_120px_150px_150px_150px_150px_150px]
          lg:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
          xl:grid-cols-[0px_0.9fr_0.9fr_0.9fr_0.9fr_0.9fr_1fr_1fr]
          
          gap-10 transition-all cursor-pointer items-center
        ${
          isSelected
           ? "bg-secondary hover:bg-secondary border-border rounded-xl"
              : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        {/* Checkbox */}
        <div >
          <CheckBox
            checked={isSelected}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>

        {/* Candidate Name */}
        <div className="text-left">
          <span className="text-subtext font-medium line-clamp-1">
            {data.candidateName || "NA"}
          </span>
        </div>

        {/* Email */}
        <div className="text-left">
          <span className="text-subtext text-sm line-clamp-1 break-all">
            {data.email || "NA"}
          </span>
        </div>

        {/* Phone */}
        <div className="text-left">
          <span className="text-subtext text-sm line-clamp-1">
            {data.phone || "NA"}
          </span>
        </div>

        {/* Resume URL */}
        {/* <div className="text-left">
          {data.resumeUrl ? (
            <a
              href={data.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline hover:text-blue-800"
            >
              View Resume
            </a>
          ) : (
            <span className="text-subtext text-sm">NA</span>
          )}
        </div> */}


 {/* Resume URL with Dialog */}
        <div className="text-left">
          {data.resumeUrl ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="text-blue-600 text-sm underline hover:text-blue-800">
                  View Resume
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                  <DialogTitle>{data.candidateName}'s Resume</DialogTitle>
                </DialogHeader>
                <iframe
                  src={data.resumeUrl}
                  className="w-full h-[600px] border"
                  title="Resume Preview"
                ></iframe>
                <DialogFooter className="flex justify-between mt-2">
                  <a
                    href={data.resumeUrl}
                    download
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download
                  </a>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-subtext text-sm">NA</span>
          )}
        </div>

        {/* Experience */}
        <div className="text-left">
          {data.experience && data.experience.length > 0 ? (
            <div className="space-y-1">
              {data.experience.map((exp, index) => (
                <div key={index} className="text-xs text-subtext">
                  <span className="font-medium">{exp.role}</span>
                  <br />
                  <span className="text-gray-500">
                    {exp.company} • {exp.years} yr
                    {/* {exp.years !== "1" && exp.years !== 1 ? "s" : ""} */}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-subtext text-sm">NA</span>
          )}
        </div>

        {/* Skills */}
        {/* <div className="text-left">
          {data.skills && data.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {data.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{data.skills.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-subtext text-sm">NA</span>
          )}
        </div> */}

        {/* Current CTC */}
        {/* <div className="text-left">
          <span className="text-subtext text-sm line-clamp-1">
            {data.currentCTC || "NA"}
          </span>
        </div> */}

        {/* Expected CTC */}
        {/* <div className="text-left">
          <span className="text-subtext text-sm line-clamp-1">
            {data.expectedCTC || "NA"}
          </span>
        </div> */}

        {/* Notice Period */}
        {/* <div className="text-left">
          <span className="text-subtext text-sm line-clamp-1">
            {data.noticePeriod || "NA"}
          </span>
        </div> */}

        {/* Status */}
        <div className="text-left">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              data.status === "APPLIED"
                ? "bg-yellow-100 text-yellow-700"
                : data.status === "SHORTLISTED"
                ? "bg-lime-100 text-lime-300"
                : data.status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : data.status === "INTERVIEW"
                ? "bg-blue-100 text-blue-700"
                : data.status === "HIRED"
                ? "bg-green-100 text-green-700"
                 : data.status === "OFFERED"
                ? "bg-blue-100 text-blue-400"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {data.status || "NA"}
          </span>
        </div>

        {/* Source */}
        {/* <div className="text-left">
          <span className="text-subtext text-sm line-clamp-1 ml-10">
            {data.source || "NA"}
          </span>
        </div> */}

        {/* Actions */}
        <div className=" ">
          <Actions
            id={data.id}
            onDelete={handleDelete}
            data={data}
            onUpdate={onUpdate}
          />
        </div>

        {/* Created At - COMMENTED FOR FUTURE USE */}
        {/* <div className="text-left">
          <span className="text-subtext text-xs line-clamp-1">
            {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "NA"}
          </span>
        </div> */}

        {/* Updated At - COMMENTED FOR FUTURE USE */}
        {/* <div className="text-left">
          <span className="text-subtext text-xs line-clamp-1">
            {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "NA"}
          </span>
        </div> */}

        {/* Notes - COMMENTED FOR FUTURE USE */}
        {/* <div className="text-left">
          {data.Notes && data.Notes.length > 0 ? (
            <div className="space-y-1">
              <span className="text-xs text-subtext line-clamp-2">
                {data.Notes[0].note}
              </span>
              {data.Notes.length > 1 && (
                <span className="text-xs text-gray-500">
                  +{data.Notes.length - 1} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-subtext text-sm">NA</span>
          )}
        </div> */}

        {/* History - COMMENTED FOR FUTURE USE */}
        {/* <div className="text-left">
          {data.History && data.History.length > 0 ? (
            <div className="space-y-1">
              {data.History.slice(0, 2).map((h, index) => (
                <div key={index} className="text-xs text-subtext">
                  {h.oldStatus} → {h.newStatus}
                </div>
              ))}
              {data.History.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{data.History.length - 2} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-subtext text-sm">NA</span>
          )}
        </div> */}
      </div>
    );
  }
);

ApplicationCard.displayName = "ApplicationCard";

export default ApplicationCard;