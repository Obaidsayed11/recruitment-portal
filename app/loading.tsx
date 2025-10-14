import Logo from "@/components/Navbar/Logo";
import React from "react";

const loading = () => {
  return (
    <div className="bg-white w-screen h-[calc(100vh-80px)] grid place-content-center">
      <Logo
        className="animate-pulse w-[250px]"
        logo="/foodland-logo.png"
        companyName="Foodland"
      />
    </div>
  );
};

export default loading;
