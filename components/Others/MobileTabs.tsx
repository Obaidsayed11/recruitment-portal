"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface MobileTabsProps {
  tabButtons: {
    label: string;
    value: string;
    className: string;
  }[];
  queryKey: string; // e.g., "status"
}

const MobileTabs: React.FC<MobileTabsProps> = ({ tabButtons, queryKey }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue =
    searchParams?.get(queryKey) || tabButtons[0]?.value || "";
  const [active, setActive] = useState(initialValue);

  const handleTabButtons = (currentTab: string) => {
    setActive(currentTab);
    const params = new URLSearchParams(Array.from(searchParams?.entries()));
    params.set(queryKey, currentTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    // Sync state with URL changes
    const newValue = searchParams?.get(queryKey);
    if (newValue && newValue !== active) {
      setActive(newValue);
    }
  }, [active, queryKey, searchParams]);

  return (
    <div className="w-full flex sticky top-[68px] bg-white z-10">
      {tabButtons.map((button) => (
        <button
          onClick={() => handleTabButtons(button.value)}
          key={button.value}
          type="button"
          className={`${
            active === button.value
              ? `${button.className} border-b-2`
              : "text-text bg-white"
          } px-3 py-1.5 w-full border-b-2 font-medium cursor-pointer`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default MobileTabs;
