import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Loading = ({ className, message = "Processing your underwater masterpiece..." }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6 p-8", className)}>
      <div className="relative">
        <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center animate-pulse">
          <ApperIcon name="Waves" className="w-8 h-8 text-white animate-wave" />
        </div>
        <div className="absolute -inset-2 bg-ocean-gradient rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-ocean-teal rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-ocean-teal rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-ocean-teal rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <p className="text-white font-medium">{message}</p>
        <p className="text-gray-400 text-sm">This may take a few moments</p>
      </div>
      
      {/* Shimmer skeleton for image editing interface */}
      <div className="w-full max-w-4xl space-y-4 mt-8">
        <div className="flex space-x-4">
          <div className="w-12 bg-slate-dark rounded-lg h-64 animate-pulse"></div>
          <div className="flex-1 bg-slate-dark rounded-lg h-64 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer"></div>
          </div>
          <div className="w-64 bg-slate-dark rounded-lg h-64 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;