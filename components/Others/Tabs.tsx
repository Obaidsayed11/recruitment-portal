"use client";
import { useTabContext } from "@/context/TabsContext";
import React, { useEffect } from "react";

interface TabsProps {
  tabButtons: {
    label: string;
    value: string;
  }[];
   className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabButtons , className}) => {
  const { activeTab, setActiveTab } = useTabContext();

  // Set first tab as default if not already set
  useEffect(() => {
    if (!activeTab && tabButtons.length > 0) {
      setActiveTab(tabButtons[0].value);
    }
  }, [tabButtons, activeTab, setActiveTab]);

  return (
     <div className={`max-w-full overflow-x-auto noScrollBar ${className || ""}`}>
      <div className="flex w-max">
        {tabButtons.map((button) => (
          <button
            key={button.value}
            onClick={() => setActiveTab(button.value)}
            type="button"
            className={`${
              activeTab === button.value
                ? "border-primary text-primary border-b-2 bg-primary/10"
                : "text-text border-b-2 bg-white"
            } px-10 py-1.5 font-medium cursor-pointer whitespace-nowrap`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
