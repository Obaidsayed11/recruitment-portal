"use client";
import React from "react";
import SelectAll from "./SelectAll";

interface HeaderProps {
  checkBox: boolean;
  headersall: HeadersOption[];
  isAllSelected?: boolean;
  className1?: string;
  handleSelectAll?: (isChecked: boolean) => void;
}

interface HeadersOption {
  value: string;
}

const Header: React.FC<HeaderProps> = ({
  checkBox,
  isAllSelected = false,
  handleSelectAll = () => {},
  className1,
  headersall,
}) => {
  return (
    <div
      className={`${className1} bg-accent mb-2 px-2 py-1 rounded-md items-center `}
    >
      {checkBox && (
        <SelectAll
          handleSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
        />
      )}

      {headersall.map((headerOption, index) => (
        <span
          key={index}
          className={`last:justify-self-center p-0 focus:outline-none`}
        >
          {headerOption.value}
        </span>
      ))}
    </div>
  );
};

export default Header;
