import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PerformanceIndicator = ({ className, isProcessing, processingStatus }) => {
  const [memoryUsage, setMemoryUsage] = useState(45);
  const [processingSpeed, setProcessingSpeed] = useState("Normal");
  const [showDetails, setShowDetails] = useState(false);

  // Simulate memory usage updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryUsage(prev => {
        const variation = (Math.random() - 0.5) * 10;
        const newValue = prev + variation;
        return Math.max(20, Math.min(85, newValue));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Determine performance status
  const getPerformanceStatus = () => {
    if (memoryUsage > 80) return { status: "warning", color: "text-amber-400", message: "High memory usage" };
    if (memoryUsage > 60) return { status: "caution", color: "text-yellow-400", message: "Moderate usage" };
    return { status: "good", color: "text-green-400", message: "Optimal performance" };
  };

  const performance = getPerformanceStatus();

  return (
    <div className={cn("fixed bottom-4 right-4 z-30", className)}>
      <Card 
        className={cn(
          "transition-all duration-300 cursor-pointer",
          showDetails ? "w-72" : "w-48",
          isProcessing && "border-ocean-teal/50"
        )}
        onClick={() => setShowDetails(!showDetails)}
      >
        <CardContent className="p-3">
          {/* Main Status */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isProcessing ? "bg-ocean-teal animate-pulse" : performance.color.replace('text-', 'bg-')
              )} />
              {isProcessing && (
                <div className="absolute -inset-1 bg-ocean-teal/30 rounded-full animate-ping" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {isProcessing ? "Processing..." : "Performance"}
                </span>
                <ApperIcon 
                  name={showDetails ? "ChevronUp" : "ChevronDown"} 
                  className="w-3 h-3 text-gray-400" 
                />
              </div>
              
              {isProcessing && processingStatus ? (
                <div className="text-xs text-ocean-teal">{processingStatus}</div>
              ) : (
                <div className={cn("text-xs", performance.color)}>
                  {performance.message}
                </div>
              )}
            </div>
          </div>

          {/* Detailed View */}
          {showDetails && (
            <div className="mt-4 space-y-3 border-t border-slate-dark pt-3">
              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white">{memoryUsage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-darker rounded-full h-1.5">
                  <div 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      memoryUsage > 80 ? "bg-red-400" : 
                      memoryUsage > 60 ? "bg-yellow-400" : "bg-green-400"
                    )}
                    style={{ width: `${memoryUsage}%` }}
                  />
                </div>
              </div>

              {/* Processing Speed */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Processing Speed</span>
                <div className="flex items-center space-x-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    processingSpeed === "Fast" ? "bg-green-400" :
                    processingSpeed === "Normal" ? "bg-yellow-400" : "bg-red-400"
                  )} />
                  <span className="text-white">{processingSpeed}</span>
                </div>
              </div>

              {/* Active Processes */}
              {isProcessing && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Active Tasks</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-1 h-1 bg-ocean-teal rounded-full animate-pulse" />
                      <span className="text-gray-300">Image Processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-1 h-1 bg-ocean-teal rounded-full animate-pulse" />
                      <span className="text-gray-300">Adjustment Rendering</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization Suggestions */}
              {memoryUsage > 70 && (
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-start space-x-2">
                    <ApperIcon name="AlertTriangle" className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-amber-400">Optimization Tip</div>
<div className="text-xs text-gray-300 mt-1">
                        Consider reducing image resolution or closing unused browser tabs to improve depth editing performance.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceIndicator;