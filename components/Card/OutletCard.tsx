import apiClient from "@/lib/axiosInterceptor";
import { OutletCardProps } from "@/types/interface";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import Image from "next/image";
import { BASE_URL } from "@/config";

const OutletCard: React.FC<OutletCardProps> = ({
  data,
  onCardSelect,
  onDelete,
  onUpdate,
  isSelected,
}) => {
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCardSelect(data.id, event.target.checked);
  };

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/admin/outlets/${data.id}`);
      toast.success(response.data.message);
      onDelete(data.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap grid-cols-[20px_250px_250px_150px_150px_200px_200px_150px_100px] xl:grid-cols-[20px_2fr_1.5fr_1fr_1fr_1fr_1.5fr_1fr_.5fr] gap-5  transition-all ease-linear border items-center ${
        isSelected
          ? "bg-secondary hover:bg-secondary border-border rounded-xl"
          : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
      }`}
    >
      <CheckBox
        checked={isSelected}
        handleCheckboxChange={handleCheckboxChange}
      />
      <div>
        <h4 className="font-medium text-text line-clamp-1 text-wrap">
          {data.name && `${data.name || "NA"} `}
        </h4>
        <span className="text-subtext text-sm line-clamp-1 text-wrap">
          {`${data.id && data.id}` || "NA"}
        </span>
      </div>

      <span className="text-subtext text-sm line-clamp-2">
        {`${data.address && data.address}` || "NA"}
      </span>
      <div>
        <span className="text-subtext text-sm line-clamp-1">
          {`${data.Pincode.City.name && data.Pincode.City.name}` || "NA"}
        </span>
        <span className="text-subtext text-sm line-clamp-1">
          {`${data.Pincode.State.name && data.Pincode.State.name}` || "NA"}
        </span>
      </div>
      <span className="text-subtext text-sm line-clamp-1">
        {`${data.Pincode.code && data.Pincode.code}` || "NA"}
      </span>
      <div>
        <span className="text-subtext text-sm line-clamp-1">
          {`${data.name && data.name}` || "NA"}
        </span>
        <span className="text-subtext text-sm line-clamp-1">
          {`${data.name && data.name}` || "NA"}
        </span>
      </div>
      <span className="text-subtext text-sm line-clamp-1">
        {`${data.name && data.name}` || "NA"}
      </span>

      <div>
        <span className="text-subtext text-sm line-clamp-1">
          {(data.createdAt && data.createdAt.split("T")[0]) || "NA"}
        </span>
        <span className="text-subtext text-sm line-clamp-1">
          {(data.updatedAt && data.updatedAt.split("T")[0]) || "NA"}
        </span>
      </div>
      <Actions
        id={data.id}
        onDelete={handleDelete}
        data={data}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default OutletCard;
