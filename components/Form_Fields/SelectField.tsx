import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";

interface SelectFieldProps {
  label?: string;
  name: string;
  placeholder: string;
  formItemClassName?: string;
  formLabelClassName?: string;
  className?: string;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  className,
  placeholder,
  formItemClassName,
  options,
  formLabelClassName,
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${formItemClassName} gap-2`}>
          {label && (
            <FormLabel
              className={`${formLabelClassName} text-text font-medium text-sm`}
            >
              {label}
            </FormLabel>
          )}
          <FormControl className="w-full max-w-full">
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger
                className={`${className} bg-white w-full min-w-[200px] text-text`}
              >
                <SelectValue
                  placeholder={placeholder}
                  className="max-w-full w-full"
                />
              </SelectTrigger>
              <SelectContent className="w-full max-w-full border-border border">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
