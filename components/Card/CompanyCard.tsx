import apiClient from "@/lib/axiosInterceptor";
import { CompanyCardProps } from "@/types/companyInterface";
import React, { forwardRef } from "react";
import { toast } from "sonner";
import CheckBox from "../Others/CheckBox";
import Actions from "../Others/Actions";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

const CompanyCard = forwardRef<HTMLDivElement, CompanyCardProps>(
  ({ data, isSelected, onCardSelect, onDelete, onUpdate, onClick }, ref) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation(); // Prevent row click when clicking checkbox
      onCardSelect(data.id, event.target.checked);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/company/${data.id}`);
        toast.success(response.data.message);
        onDelete(data.id);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const handleRowClick = () => {
      if (onClick) {
        onClick();
      }
    };

    const handleActionClick = (event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent row click when clicking actions
    };

    const handleLinkClick = (event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent row click when clicking links
    };


    // Helper function to ensure URL has protocol
    const formatUrl = (url: string | null | undefined) => {
      if (!url) return null;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://${url}`;
    };

    // Helper component for URL links
    const UrlLink = ({ url, label }: { url: string | null | undefined; label?: string }) => {
      const formattedUrl = formatUrl(url);
      
      if (!formattedUrl) {
        return <span className="text-subtext text-sm">NA</span>;
      }
        return (
        <a
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="group/link flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm line-clamp-1 transition-colors"
          title={formattedUrl} // Built-in browser tooltip
        >
          <span className="line-clamp-1">{label || formattedUrl}</span>
          <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      );
    };


    return (
      <div
        ref={ref}
        onClick={handleRowClick}
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid grid-cols-[20px_2.4fr_2.4fr_2.4fr_2.4fr_2.5fr_2.5fr] gap-5 items-center cursor-pointer transition-all text-left${
          isSelected
            ? "bg-secondary hover:bg-secondary border-border rounded-xl"
            : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`} 
      >
        <div onClick={(e) => e.stopPropagation()}>
          <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />
        </div>
         <div className="grid grid-cols-[50px_1fr] gap-2 items-center">
  {/* Avatar - Always present to maintain grid structure */}
  {data?.logoUrl ? (
    <Image
      className="w-[100px] h-[50px] rounded-lg object-contain bg-white border"
      src={data.logoUrl}
      alt={data.name && data.name}
      width={50}
      height={50}
    />
  ) : (
    <div className="w-[50px] h-[50px] rounded-lg bg-gray-400 flex items-center justify-center text-white font-bold text-xl">
      {data?.name?.charAt(0).toUpperCase() || "N"}
    </div>
  )}

  {/* Name */}
  <h4 className="font-medium text-text line-clamp-2">
    {data?.name || "NA"}
  </h4>
</div>
        
        {/* <span className="text-subtext line-clamp-1">{data.websiteUrl || "NA"}</span> */}
         <div className="overflow-hidden truncate">
          <UrlLink url={data.websiteUrl} label={data.websiteUrl} />
        </div>
         {/* Career Page URL */}
        <div className="overflow-hidden truncate">
          <UrlLink url={data.careerPageUrl} label={data.careerPageUrl} />
        </div>
        <h4 className="font-medium text-text line-clamp-2">
    {data?.location || "NA"}
  </h4>
          {/* Logo URL */}
     

        <span className="text-sm line-clamp-2 text-clip">{data.description || "NA"}</span>
        <div onClick={handleActionClick}>
          <Actions
            id={data.id}
            onDelete={handleDelete}
            data={data}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    );
  }
);

CompanyCard.displayName = "CompanyCard";

export default CompanyCard;