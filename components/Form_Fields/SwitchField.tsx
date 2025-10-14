import React from "react";
import { Switch } from "../ui/switch";
import { FormLabel } from "../ui/form";
import { Label } from "@radix-ui/react-label";

interface ToggleSwitchProps {
  title: string;
  pValue: string;
  nValue: string;
  className?: string;
  value: boolean | undefined; // Controlled state
  onChange: (newState: boolean) => void; // Callback for state change
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  title,
  value,
  pValue,
  nValue,
  onChange,
  className,
}) => {
  const handleToggle = () => {
    onChange(!value); // Toggle the state
  };

  return (
    <div className={`${className} grid gap-3`}>
      <Label className="text-text font-medium text-base">{title}</Label>
      <div className="border border-border rounded-lg h-11 p-2 flex items-center gap-5 w-full justify-between px-5">
        <label
          htmlFor="no"
          className={`cursor-pointer text-fontPrimary ${
            !value ? "font-medium text-primary" : ""
          }`}
          onClick={() => onChange(false)}
        >
          {nValue || "No"}
        </label>
        <Switch id="switch" checked={value} onClick={handleToggle} />
        <label
          htmlFor="yes"
          className={`cursor-pointer text-fontPrimary ${
            value ? "font-medium text-primary" : ""
          }`}
          onClick={() => onChange(true)}
        >
          {pValue || "Yes"}
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
