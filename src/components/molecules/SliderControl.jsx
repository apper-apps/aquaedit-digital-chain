import React, { useState, useCallback } from "react";
import Label from "@/components/atoms/Label";
import Slider from "@/components/atoms/Slider";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SliderControl = ({ 
  label, 
  value,
  onChange, 
  min = -100, 
  max = 100, 
  step = 1, 
  defaultValue = 0,
  className,
  suffix = "",
  precision = 0,
  showValue = true,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = useCallback((e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    setInputValue(newValue.toString());
  }, [onChange]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  }, [onChange, min, max]);

  const handleReset = useCallback(() => {
    onChange(defaultValue);
    setInputValue(defaultValue.toString());
  }, [onChange, defaultValue]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">{label}</Label>
        <Button
          variant="ghost"
          size="small"
          onClick={handleReset}
          className="text-xs py-1 px-2 h-auto"
        >
          Reset
        </Button>
      </div>
      <div className="space-y-2">
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            className="w-20 h-8 text-xs"
            type="number"
            min={min}
            max={max}
            step={step}
          />
          {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
        </div>
      </div>
    </div>
  );
};

export default SliderControl;