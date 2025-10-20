"use client";
import { useTabContext } from "@/context/TabsContext";
import React, { useEffect } from "react";

interface TabButton {
  label: string;
  value: string;
}

interface TabsProps {
  tabButtons: TabButton[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ 
  tabButtons, 
  activeTab: controlledActiveTab,
  onTabChange,
  className 
}) => {
  const { activeTab: contextActiveTab, setActiveTab } = useTabContext();

  // Use controlled activeTab if provided, otherwise use context
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : contextActiveTab;

  // Set first tab as default if not already set
  useEffect(() => {
    if (!activeTab && tabButtons.length > 0) {
      setActiveTab(tabButtons[0].value);
    }
  }, [tabButtons, activeTab, setActiveTab]);

  const handleTabClick = (value: string) => {
    // Update context
    setActiveTab(value);
    
    // If onTabChange callback is provided, call it (this updates URL)
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className={`max-w-full overflow-x-auto noScrollBar ${className || ""}`}>
      <div className="flex w-max">
        {tabButtons.map((button) => (
          <button
            key={button.value}
            onClick={() => handleTabClick(button.value)}
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