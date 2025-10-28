import apiClient from "@/lib/axiosInterceptor";
import { UserCardProps } from "@/types/usertypes";
import { useParams, useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";
import Image from "next/image";
import { BASE_URL } from "@/config";

const UserCard = forwardRef<HTMLDivElement, UserCardProps>(
  ({ data, isSelected, onCardSelect, onDelete, onUpdate }, ref) => {
    const router = useRouter();

    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      onCardSelect(data.id, event.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/user/${data.id}`);
        toast.success(response.data.message);
        onDelete(data.id);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const userId = data?.id

    // const handleEditUser = () => {
    //   router.push(`/dashboard/users/update-user${userId}`)
    // }

    return (
      <div
        ref={ref}
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid text-nowrap grid-cols-[20px_250px_150px_150px_250px_150px_150px_100px] xl:grid-cols-[20px_1.5fr_1.1fr_1fr_2fr_1fr] gap-5  transition-all ease-linear border items-center ${
          isSelected
            ? "bg-secondary hover:bg-secondary border-border rounded-xl"
            : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        <CheckBox
          checked={isSelected}
          handleCheckboxChange={handleCheckboxChange}
        />
        <div className="grid grid-cols-[50px_1fr] gap-2 items-center">
          {/* {data.photo ? (
            <Image
              className="w-[50px] h-[50px] rounded-lg object-cover bg-secondary border "
              src={`${BASE_URL}${data.photo || "/"}`}
              alt={data.fullName && data.fullName}
              width={100}
              height={100}
            />
          ) :  */}
          {data && (
            <div className="w-[50px] h-[50px] rounded-lg bg-gray-400 flex items-center overflow-hidden justify-center text-white font-bold text-xl">
              {data.fullName?.charAt(0).toUpperCase() || "NA"}
            </div>
          )}
          <h4 className="font-medium text-text line-clamp-2 text-wrap">
            {data.fullName && `${data.fullName || "NA"} `}
          </h4>
        </div>
        <span className="text-subtext line-clamp-1">
          {`${
            data.role 
            // &&
            // data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase()
          }` || "NA"}
        </span>

        <span className="text-subtext text-base line-clamp-1">
          {`${data.phone && data.phone}` || "NA"}
        </span>
        <span className="text-subtext text-base line-clamp-1">
          {`${data.email && data.email}` || "NA"}
        </span>

        {/* <span className="text-subtext text-sm line-clamp-1">
          {(data.createdAt && data.createdAt.split("T")[0]) || "NA"}
        </span>
        <span className="text-subtext text-sm line-clamp-1">
          {(data.updatedAt && data.updatedAt.split("T")[0]) || "NA"}
        </span> */}
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

UserCard.displayName = "UserCard";

export default UserCard;
