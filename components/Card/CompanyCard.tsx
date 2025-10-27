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
        className={`bg-background p-2 group w-max xl:w-full my-1 border-t border-t-[#F5F5F5] border-b border-b-[#F5F5F5] grid grid-cols-[20px_1fr_2fr_1fr_1fr_3fr_1fr] gap-5 items-center cursor-pointer transition-all ${
          isSelected
            ? "bg-secondary hover:bg-secondary border-border rounded-xl"
            : "hover:border hover:border-border hover:bg-secondary border border-white hover:rounded-xl"
        }`}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <CheckBox checked={isSelected} handleCheckboxChange={handleCheckboxChange} />
        </div>
         <div className="overflow-hidden">
  {data.logoUrl ? (
    <div className="flex items-center gap-2">
      <Image
        className="w-[50px] h-[50px] rounded-lg object-cover bg-secondary border"
        src={data.logoUrl}
       alt={data.name || "Company Logo"}

        width={50}
        height={50}
      />
      {/* <a
        href={data.logoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleLinkClick}
        className="group/link text-blue-600 hover:text-blue-800 text-sm transition-colors flex items-center gap-1"
        title={data.logoUrl}
      >
        <span className="line-clamp-1">View Logo</span>
        <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
      </a> */}
    </div>
  ) : (
    <span className="text-subtext text-sm">NA</span>
  )}
</div>
        <span className="font-medium text-text line-clamp-2">{data.name || "NA"}</span>
        {/* <span className="text-subtext line-clamp-1">{data.websiteUrl || "NA"}</span> */}
         <div className="overflow-hidden">
          <UrlLink url={data.websiteUrl} label={data.websiteUrl} />
        </div>
         {/* Career Page URL */}
        <div className="overflow-hidden">
          <UrlLink url={data.careerPageUrl} label={data.careerPageUrl} />
        </div>
          {/* Logo URL */}
     

        <span className="text-subtext line-clamp-2">{data.description || "NA"}</span>
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