import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base styles
        "flex w-full  rounded-md bg-white px-3 py-1 text-base md:text-sm h-11",
        // border and placeholder styles
        "border border-gray-300 placeholder:text-sm text-text",
        // focus and transition styles
        "focus:outline-none focus-visible:outline-none focus:border-primary focus:ring focus:ring-primary  transition-all duration-200",
        // disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
