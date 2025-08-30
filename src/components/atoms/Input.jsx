import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        "border-slate-dark bg-slate-darker text-white placeholder-gray-400",
        "dark:border-slate-dark dark:bg-slate-darker dark:text-white dark:placeholder-gray-400",
        "light:border-gray-300 light:bg-white light:text-gray-900 light:placeholder-gray-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;