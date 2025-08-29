import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import SliderControl from "@/components/molecules/SliderControl";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AdjustmentPanel = ({ adjustments, onAdjustmentChange, onResetAll, className }) => {
  const adjustmentControls = [
    { key: "exposure", label: "Exposure", min: -200, max: 200, step: 10, defaultValue: 0, suffix: "" },
    { key: "contrast", label: "Contrast", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" },
    { key: "highlights", label: "Highlights", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" },
    { key: "shadows", label: "Shadows", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" },
    { key: "saturation", label: "Saturation", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" },
    { key: "vibrance", label: "Vibrance", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" },
    { key: "warmth", label: "Warmth", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" },
    { key: "clarity", label: "Clarity", min: -100, max: 100, step: 5, defaultValue: 0, suffix: "" }
  ];

  return (
    <Card className={cn("w-full lg:w-80 h-fit", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <ApperIcon name="Sliders" className="w-5 h-5 text-ocean-teal" />
            <span>Adjustments</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="small"
            onClick={onResetAll}
            title="Reset all adjustments"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {adjustmentControls.map((control) => (
          <SliderControl
            key={control.key}
            label={control.label}
            value={adjustments[control.key]}
            onChange={(value) => onAdjustmentChange(control.key, value)}
            min={control.min}
            max={control.max}
            step={control.step}
            defaultValue={control.defaultValue}
            suffix={control.suffix}
          />
        ))}
        
        <div className="pt-4 border-t border-slate-dark">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Underwater Enhancements</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="small" className="text-xs">
                <ApperIcon name="Droplets" className="w-3 h-3 mr-1" />
                Remove Cast
              </Button>
              <Button variant="secondary" size="small" className="text-xs">
                <ApperIcon name="Sparkles" className="w-3 h-3 mr-1" />
                Reduce Scatter
              </Button>
              <Button variant="secondary" size="small" className="text-xs">
                <ApperIcon name="Sun" className="w-3 h-3 mr-1" />
                Auto Depth
              </Button>
              <Button variant="secondary" size="small" className="text-xs">
                <ApperIcon name="Palette" className="w-3 h-3 mr-1" />
                Coral Boost
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjustmentPanel;