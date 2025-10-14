import React, { forwardRef } from "react";

const CardUi = forwardRef<
  HTMLDivElement,
  Readonly<{
    children: React.ReactNode;
    title: string;
    className?: string;
    headingClassName?: string;
  }>
>(({ children, title, className, headingClassName }, ref) => {
  return (
    <div
      ref={ref}
      className={`${className} grid gap-4 p-3 border rounded-xl w-full bg-white`}
    >
      <h2
        className={`${headingClassName} p-2 text-fontPrimary font-semibold rounded-lg bg-[#E9F8FF]`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
});

CardUi.displayName = "CardUi"; // Adding displayName is useful for debugging in React DevTools

export default CardUi;
