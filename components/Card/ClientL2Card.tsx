import Link from "next/link";
import React, { ReactNode } from "react";

interface ClientL2CardProps {
  svg?: ReactNode; // Accepts an SVG or React icon
  label?: string; // Label text
  text?: string; // Additional text for the card
  clientId?: string | number; // Client ID
  number?: string | number; // Number to display, can be string or number
  className?: string; // Optional className for additional styling
  className2?: string; // Optional className for icon background styling
  className3?: string; // Optional className for number styling
  link?: string; // URL for the card link
  linkColor?: string; // Color for the arrow SVG when link is present
}

const ClientL2Card: React.FC<ClientL2CardProps> = ({
  svg,
  label,
  clientId,
  number,
  className,
  className2,
  className3,
  text,
  link,
  linkColor = "#3F40A8",
  
}) => {
  const CardContent = (
    <div className={`${className} flex py-5 h-[110px] px-[14px]`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-5">
          {svg && (
            <div className={`p-[10px] rounded-full ${className2}`}>{svg}</div>
          )}
          <div className="flex flex-col gap-0 leading-[40px]">
            {label && (
              <p className="text-lg text-text leading-[23px] font-normal">
                {label}
              </p>
            )}
            {text && (
              <p className="text-xl text-text leading-[18px] font-normal">
                {text}
              </p>
            )}
            {number && (
              <p className={`font-semibold text-3xl ${className3}`}>{number}</p>
            )}
          </div>
        </div>
        {link && (
          <div className="flex self-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1 13L13 1M13 1H4M13 1V10"
                stroke={linkColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return link ? (
    <Link href={link}>{CardContent}</Link>
  ) : (
    <div>{CardContent}</div>
  );
};

export default ClientL2Card;
