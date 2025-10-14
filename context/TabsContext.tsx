"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

type TabContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<string>("");

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};
