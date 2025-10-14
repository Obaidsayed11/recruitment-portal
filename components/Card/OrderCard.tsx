import apiClient from "@/lib/axiosInterceptor";
import { OrderCardProps } from "@/types/interface";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import Image from "next/image";
import { BASE_URL } from "@/config";

const OrderCard: React.FC<OrderCardProps> = ({
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
      const response = await apiClient.delete(`/admin/orders/${data.id}`);
      toast.success(response.data.message);
      onDelete(data.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap grid-cols-[20px_200px_200px_200px_250px_250px_120px_100px] xl:grid-cols-[20px_1fr_1.3fr_1.3fr_1.3fr_1.3fr_.8fr_.5fr] gap-5  transition-all ease-linear border items-center ${
        isSelected
          ? "bg-secondary hover:bg-secondary border-border rounded-xl"
          : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
      }`}
    >
      <CheckBox
        checked={isSelected}
        handleCheckboxChange={handleCheckboxChange}
      />

      <span className="text-text line-clamp-2 text-sm text-wrap">
        {data.invoiceNo && `${data.invoiceNo || "NA"} `}
      </span>
      <span className="text-text line-clamp-2 text-sm text-wrap">
        {data.Outlet.User.fullName && `${data.Outlet.User.fullName || "NA"} `}
      </span>

      <span className="text-text text-base line-clamp-2 text-wrap">
        {`${data.Driver.fullName && data.Driver.fullName}` || "NA"}
      </span>
      <span className="text-subtext text-sm line-clamp-1">
        {(data.dispatch && data.dispatch.split("T")[0]) || "NA"}
      </span>
      <span className="text-subtext text-sm line-clamp-1">
        {(data.delivery && data.delivery.split("T")[0]) || "NA"}
      </span>
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium w-fit
    ${
      data.status === "PENDING" &&
      "bg-yellow-100 text-yellow-800 border border-yellow-800"
    }
    ${
      data.status === "COMPLETED" &&
      "bg-green-100 text-green-800 border border-green-800"
    }
    ${
      data.status === "DISPATCHED" &&
      "bg-blue-100 text-blue-800 border border-blue-800"
    }
    ${!data.status && "bg-gray-100 text-gray-500 border border-gray-300"}
  `}
      >
        {data.status
          ? data.status.charAt(0).toUpperCase() +
            data.status.slice(1).toLowerCase()
          : "NA"}
      </span>

      <Actions
        id={data.id}
        onDelete={handleDelete}
        data={data}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default OrderCard;
