import React from "react";

interface SvgProps {
  isActive?: boolean;
  stat?: any;
}

const ReportsSvg: React.FC<SvgProps> = ({ isActive, stat }) => {
  const strokeColor = isActive || stat ? "#ffffff" : "#494949";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-all duration-300"
    >
      <rect
        width="18"
        height="18"
        x="3"
        y="3"
        rx="2"
        ry="2"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <line
        x1="3"
        x2="21"
        y1="9"
        y2="9"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <line
        x1="3"
        x2="21"
        y1="15"
        y2="15"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <line
        x1="9"
        x2="9"
        y1="9"
        y2="21"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
      <line
        x1="15"
        x2="15"
        y1="9"
        y2="21"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:stroke-white"
      />
    </svg>
  );
};

export default ReportsSvg;
