import apiClient from "@/lib/axiosInterceptor";
import { ProductCardProps } from "@/types/interface";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import Image from "next/image";
import { BASE_URL } from "@/config";

const ProductCard: React.FC<ProductCardProps> = ({
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
      const response = await apiClient.delete(`/admin/products/${data.id}`);
      toast.success(response.data.message);
      onDelete(data.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap grid-cols-[20px_250px_150px_250px_200px_120px_120px_100px] xl:grid-cols-[20px_1.5fr_1fr_2fr_1fr_.8fr_.8fr_.5fr] gap-5  transition-all ease-linear border items-center ${
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
        {data.id && `${data.id || "NA"} `}
      </span>
      <span className="text-text line-clamp-2 text-sm text-wrap">
        {data.code && `${data.code || "NA"} `}
      </span>

      <span className="text-text text-base line-clamp-2 text-wrap">
        {`${data.name && data.name}` || "NA"}
      </span>
      <span className="text-subtext text-sm line-clamp-1 text-wrap">
        {`${data.Category.name && data.Category.name}` || "NA"}
      </span>

      <span className="text-subtext text-sm line-clamp-1">
        {(data.createdAt && data.createdAt.split("T")[0]) || "NA"}
      </span>
      <span className="text-subtext text-sm line-clamp-1">
        {(data.updatedAt && data.updatedAt.split("T")[0]) || "NA"}
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

export default ProductCard;
