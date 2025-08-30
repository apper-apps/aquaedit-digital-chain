import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300",
        "border-slate-dark bg-slate-dark/50 backdrop-blur-sm hover:border-ocean-teal/30",
        "dark:border-slate-dark dark:bg-slate-dark/50 dark:hover:border-ocean-teal/30",
        "light:border-gray-200 light:bg-white light:hover:border-ocean-teal/30",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-white",
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };