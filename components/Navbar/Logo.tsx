"use client";
import { logoProps } from "@/types/interface";
import Image from "next/image";
import React from "react";

const Logo: React.FC<logoProps> = ({ logo, companyName, className }) => {
  return (
    <Image
      className={`${className} w-[200px] h-[50px] object-contain`}
      src={logo}
      width={500}
      height={500}
      alt={companyName}
      loading="eager"
    />
  );
};

export default Logo;
