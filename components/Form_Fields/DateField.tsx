import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { InputFieldProps } from "@/types/interface";
import { Calendar } from "lucide-react";

const DateInputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  className,
  helpingText,
  formItemClassName,
  formLabelClassName,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          {label && (
            <FormLabel
              className={`${formLabelClassName} text-text font-medium text-base`}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative w-full">
              <Input
                type="date"
                className={`no-date-icon ${className} appearance-none text-sm pr-10`}
                onClick={(e) => e.currentTarget.showPicker()}
                {...field}
              />
              <Calendar
                size={18}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              {/* Placeholder workaround: use label as floating text or mimic it above */}
              {!field.value && (
                <span className="bg-white h-10 flex items-center  absolute right-10 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                  {placeholder || "Select date"}
                </span>
              )}
            </div>
          </FormControl>
          {helpingText && (
            <p className="text-subtext text-xs font-medium">{helpingText}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateInputField;
