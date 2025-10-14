import apiClient from "@/lib/axiosInterceptor";
import { WarehouseCardProps } from "@/types/interface";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";

const WarehouseCard: React.FC<WarehouseCardProps> = ({
  data,
  onCardSelect,
  onDelete,
  onUpdate,
  isSelected,
}) => {
  const router = useRouter();
  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleCardClick = () => {
    router.push(`/admin/warehouses/${data.id}`);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCardSelect(data.id, event.target.checked);
  };

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/admin/warehouses/${data.id}`);
      toast.success(response.data.message);
      onDelete(data.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-2 group w-max 2xl:w-full cursor-pointer my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap grid-cols-[20px_250px_200px_150px_100px_250px_250px_150px_100px] 2xl:grid-cols-[20px_1.5fr_1fr_.8fr_.5fr_1.5fr_1.5fr_.5fr_.5fr] gap-5  transition-all ease-linear border items-center ${
        isSelected
          ? "bg-secondary hover:bg-secondary border-border rounded-xl"
          : "hover:border hover:border-border bg-white hover:bg-secondary border border-white hover:rounded-xl"
      }`}
    >
      <CheckBox
        checked={isSelected}
        handleCheckboxClick={handleCheckboxClick}
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

      <span className="text-subtext text-sm line-clamp-2 text-wrap">
        {`${data.address && data.address}` || "NA"}
      </span>
      <div>
        <span className="text-subtext text-sm line-clamp-1 text-wrap">
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
        <span className="text-text text-sm font-medium line-clamp-1 text-wrap">
          {`${data.WM.fullName && data.WM.fullName}` || "NA"}
        </span>
        <span className="text-subtext text-sm line-clamp-1">
          {`${data.WM.phone && data.WM.phone}` || "NA"}
        </span>
      </div>
      <div>
        <span className="text-text text-sm font-medium line-clamp-1">
          {`${data.Dispatcher.fullName && data.Dispatcher.fullName}` || "NA"}
        </span>
        <span className="text-subtext text-sm line-clamp-1">
          {`${data.Dispatcher.phone && data.Dispatcher.phone}` || "NA"}
        </span>
      </div>

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

export default WarehouseCard;
