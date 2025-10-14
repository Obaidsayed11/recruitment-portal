import { ButtonProps } from "@/types/interface";
import React from "react";

const Button: React.FC<ButtonProps> = ({
  children,
  secondary,
  icon,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md bg-primary cursor-pointer text-nowrap py-2 px-4 gap-2 text-base flex items-center justify-center transform transition-all duration-300 ease-in-out 
          ${className} 
          ${disabled ? "opacity-50 cursor-not-allowed text-white" : ""}
          ${
            secondary
              ? "bg-primary/10 border-primary border text-primary cursor-not-allowed"
              : "text-white"
          }
          hover:shadow-lg 
        `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
