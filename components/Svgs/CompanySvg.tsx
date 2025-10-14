import React from "react";

interface SvgProps {
  isActive?: boolean;
  stat?: any;
}

const CompanySvg: React.FC<SvgProps> = ({ isActive, stat }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-all duration-300"
    >
      <path
        d="M12 12h.01"
        stroke={isActive || stat ? "#ffffff" : "#494949"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <path
        d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
        stroke={isActive || stat ? "#ffffff" : "#494949"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <path
        d="M22 13a18.15 18.15 0 0 1-20 0"
        stroke={isActive || stat ? "#ffffff" : "#494949"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <rect
        width="20"
        height="14"
        x="2"
        y="6"
        rx="2"
        stroke={isActive || stat ? "#ffffff" : "#494949"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
    </svg>
  );
};

export default CompanySvg;
