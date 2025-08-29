import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Slider = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="range"
      ref={ref}
      className={cn(
        "w-full h-2 bg-slate-darker rounded-lg appearance-none cursor-pointer",
        className
      )}
      {...props}
    />
  );
});

Slider.displayName = "Slider";

export default Slider;