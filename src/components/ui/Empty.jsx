import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  className, 
  title = "No images yet", 
  message = "Upload your first underwater photo to start creating amazing edits.",
  actionLabel = "Upload Image",
  onAction,
  icon = "Image"
}) => {
  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-ocean-gradient rounded-full flex items-center justify-center animate-float">
            <ApperIcon name={icon} className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400">{message}</p>
        </div>
        
        <div className="space-y-4">
          {onAction && (
            <Button onClick={onAction} className="w-full">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-ocean-teal/20 rounded-lg flex items-center justify-center mx-auto">
                <ApperIcon name="Droplets" className="w-4 h-4 text-ocean-teal" />
              </div>
              <div>
                <p className="font-medium text-white">Color Correction</p>
                <p className="text-gray-400 text-xs">Remove blue/green casts</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-8 h-8 bg-coral/20 rounded-lg flex items-center justify-center mx-auto">
                <ApperIcon name="Sparkles" className="w-4 h-4 text-coral" />
              </div>
              <div>
                <p className="font-medium text-white">Backscatter Removal</p>
                <p className="text-gray-400 text-xs">Clean particle noise</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Empty;