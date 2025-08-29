import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PresetCard = ({ preset, onApply, className }) => {
  return (
    <Card className={cn("hover:scale-105 transition-all duration-300 cursor-pointer", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="aspect-video bg-ocean-gradient rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-30"></div>
            <ApperIcon name="Image" className="w-8 h-8 text-white/60" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-white">{preset.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{preset.description}</p>
          </div>
          <Button
            onClick={() => onApply(preset)}
            className="w-full"
            size="small"
          >
            Apply Preset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresetCard;