import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // base styles
        "flex w-full  rounded-md bg-white px-3 py-2 text-base md:text-sm min-h-16",
        // border and placeholder styles
        "border border-gray-300 placeholder:font-medium placeholder:text-[0.95rem] text-text",
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

export { Textarea };
