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
import { Textarea } from "../ui/textarea";

const TextareaField: React.FC<InputFieldProps> = ({
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
            <Textarea
              placeholder={placeholder}
              className={`${className}`}
              {...field}
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

export default TextareaField;
