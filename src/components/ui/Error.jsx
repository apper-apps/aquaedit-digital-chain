import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  title = "Something went wrong", 
  message = "We encountered an error while processing your image. Please try again.",
  onRetry
}) => {
  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400">{message}</p>
        </div>
        
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>If the problem persists:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your image file format (JPEG, PNG, RAW supported)</li>
              <li>Ensure file size is under 50MB</li>
              <li>Try refreshing the page</li>
              <li>Contact support if issues continue</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Error;