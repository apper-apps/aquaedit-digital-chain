import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PresetCard = ({ preset, onApply, className, strength = 100, previewImage = 'reef' }) => {
  return (
    <Card className={cn("hover:scale-105 transition-all duration-300 cursor-pointer", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="aspect-video bg-ocean-gradient rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-30"></div>
            <ApperIcon name="Image" className="w-8 h-8 text-white/60" />
            {preset.source && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                {preset.source.toUpperCase()}
              </div>
            )}
            {strength !== 100 && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-ocean-teal">
                {strength}%
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-white">{preset.name}</h3>
{preset.tags && Array.isArray(preset.tags) && preset.tags.length > 0 && (
                <div className="flex space-x-1">
                  {preset.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-xs bg-ocean-teal/20 text-ocean-teal px-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{preset.description}</p>
            {preset.creator && (
              <p className="text-xs text-gray-500">by {preset.creator}</p>
            )}
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