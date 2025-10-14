"use client";
import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date; // For controlled usage
  onChange?: (date: Date | undefined) => void; // For handling date selection
  placeholder?: string;
  initialDate?: Date; // For uncontrolled usage
  className?: string;
  inputClassName?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  initialDate,
  className,
  inputClassName,
}) => {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    initialDate
  );
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const date = value ?? internalDate; // Use external value if provided

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value
      ? new Date(event.target.value)
      : undefined;
    if (!value) {
      setInternalDate(selectedDate); // Update internal state only for uncontrolled usage
    }
    onChange?.(selectedDate); // Notify parent of date selection
  };

  // Open the date picker when clicking anywhere on the field
  const handleFieldClick = () => {
    inputRef.current?.showPicker(); // Show the native date picker
  };

  return (
    <div
      className={cn("relative w-full cursor-pointer", className)}
      onClick={handleFieldClick}
    >
      <input
        ref={inputRef}
        type="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
        onChange={handleDateChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full h-[36px] pr-4 pl-4 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-none text-sm cursor-pointer",
          !date && !isFocused ? "text-gray-400" : "text-black",
          inputClassName
        )}
        placeholder={isFocused ? placeholder : placeholder} // Show placeholder when unfocused
      />
    </div>
  );
};
