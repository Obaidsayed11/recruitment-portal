import apiClient from "@/lib/axiosInterceptor";
import { CategoryCardProps } from "@/types/interface";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import Image from "next/image";
import { BASE_URL } from "@/config";

const CategoryCard: React.FC<CategoryCardProps> = ({
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
      const response = await apiClient.delete(`/admin/categories/${data.id}`);
      toast.success(response.data.message);
      onDelete(data.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap grid-cols-[20px_150px_250px_150px_150px_100px] lg:grid-cols-[20px_2fr_2fr_1fr_1fr_.5fr] gap-5  transition-all ease-linear border items-center ${
        isSelected
          ? "bg-secondary hover:bg-secondary border-border rounded-xl"
          : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
      }`}
    >
      <CheckBox
        checked={isSelected}
        handleCheckboxChange={handleCheckboxChange}
      />
      <span className="text-subtext text-base line-clamp-1">
        {`${data.id && data.id}` || "NA"}
      </span>
      <span className="text-subtext text-base line-clamp-1">
        {`${data.name && data.name}` || "NA"}
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

export default CategoryCard;
