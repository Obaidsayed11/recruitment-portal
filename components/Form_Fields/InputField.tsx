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

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  className,
  placeholder,
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
        <FormItem className={`${formItemClassName} gap-2`}>
          <FormLabel
            className={`${formLabelClassName} text-text font-medium text-sm`}
          >
            {label}
             <span className="text-red-500 ml-1">*</span>
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              className={className}
              type={type}
              {...field}
              value={field.value ?? ""}
              
              
            />
          </FormControl>
          {helpingText && (
            <p className="text-subtext text-xs font-medium -mt-1">
              {helpingText}
            </p>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default InputField;
