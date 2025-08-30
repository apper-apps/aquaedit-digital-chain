import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "medium", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-teal disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-ocean-gradient text-white hover:shadow-lg hover:scale-105 active:scale-95 dark:bg-ocean-gradient",
    secondary: "bg-slate-dark text-white border border-ocean-teal hover:bg-ocean-teal/10 hover:border-ocean-teal/80 dark:bg-slate-dark dark:border-ocean-teal",
    ghost: "text-ocean-teal hover:bg-ocean-teal/10 hover:text-ocean-teal/80 dark:text-ocean-teal dark:hover:bg-ocean-teal/10",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700",
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm rounded-md",
    medium: "px-4 py-2 text-sm rounded-lg",
    large: "px-6 py-3 text-base rounded-lg",
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;