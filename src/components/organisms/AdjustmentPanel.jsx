import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SliderControl from "@/components/molecules/SliderControl";
import Button from "@/components/atoms/Button";

const AdjustmentPanel = ({ adjustments, onAdjustmentChange, onResetAll, className }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const basicControls = [
    { key: "exposure", label: "Exposure", min: -200, max: 200, step: 10, defaultValue: 0 },
    { key: "contrast", label: "Contrast", min: -100, max: 100, step: 5, defaultValue: 0 },
    { key: "highlights", label: "Highlights", min: -100, max: 100, step: 5, defaultValue: 0 },
    { key: "shadows", label: "Shadows", min: -100, max: 100, step: 5, defaultValue: 0 },
    { key: "saturation", label: "Saturation", min: -100, max: 100, step: 5, defaultValue: 0 },
    { key: "vibrance", label: "Vibrance", min: -100, max: 100, step: 5, defaultValue: 0 },
    { key: "warmth", label: "Warmth", min: -100, max: 100, step: 5, defaultValue: 0 },
    { key: "clarity", label: "Clarity", min: -100, max: 100, step: 5, defaultValue: 0 }
  ];

  const hslColors = [
    { key: "hslReds", label: "Reds", color: "#ef4444" },
    { key: "hslOranges", label: "Oranges", color: "#f97316" },
    { key: "hslYellows", label: "Yellows", color: "#eab308" },
    { key: "hslGreens", label: "Greens", color: "#22c55e" },
    { key: "hslAquas", label: "Aquas", color: "#06b6d4" },
    { key: "hslBlues", label: "Blues", color: "#3b82f6" },
    { key: "hslPurples", label: "Purples", color: "#a855f7" },
    { key: "hslMagentas", label: "Magentas", color: "#ec4899" }
  ];

  const underwaterPresets = [
    { name: "Surface", temp: 0, desc: "5600K" },
    { name: "10ft", temp: -20, desc: "4800K" },
    { name: "30ft", temp: -35, desc: "4200K" },
    { name: "60ft+", temp: -50, desc: "3800K" }
  ];

  const tabs = [
    { id: "basic", label: "Basic", icon: "Sliders" },
    { id: "color", label: "Color", icon: "Palette" },
    { id: "tone", label: "Tone", icon: "TrendingUp" },
    { id: "local", label: "Local", icon: "Target" },
    { id: "lens", label: "Lens", icon: "Camera" }
  ];

  const handleHSLChange = (colorKey, component, value) => {
    const newHSL = { ...adjustments[colorKey], [component]: value };
    onAdjustmentChange(colorKey, newHSL);
  };

  const renderBasicTab = () => (
    <div className="space-y-6">
      {basicControls.map((control) => (
        <SliderControl
          key={control.key}
          label={control.label}
          value={adjustments[control.key]}
          onChange={(value) => onAdjustmentChange(control.key, value)}
          min={control.min}
          max={control.max}
          step={control.step}
          defaultValue={control.defaultValue}
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
    </div>
  );

  const renderColorTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">HSL Selective Adjustments</h4>
        {hslColors.map((color) => (
          <div key={color.key} className="mb-4 p-3 bg-slate-darker rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.color }}></div>
              <span className="text-sm font-medium text-gray-300">{color.label}</span>
            </div>
            <div className="space-y-2">
              <SliderControl
                label="Hue"
                value={adjustments[color.key]?.hue || 0}
                onChange={(value) => handleHSLChange(color.key, "hue", value)}
                min={-180}
                max={180}
                step={1}
                defaultValue={0}
                className="text-xs"
              />
              <SliderControl
                label="Saturation"
                value={adjustments[color.key]?.saturation || 0}
                onChange={(value) => handleHSLChange(color.key, "saturation", value)}
                min={-100}
                max={100}
                step={1}
                defaultValue={0}
                className="text-xs"
              />
              <SliderControl
                label="Luminance"
                value={adjustments[color.key]?.luminance || 0}
                onChange={(value) => handleHSLChange(color.key, "luminance", value)}
                min={-100}
                max={100}
                step={1}
                defaultValue={0}
                className="text-xs"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-dark">
        <h4 className="text-sm font-medium text-gray-300 mb-3">White Balance Correction</h4>
        <div className="space-y-4">
          <SliderControl
            label="Temperature"
            value={adjustments.temperature || 0}
            onChange={(value) => onAdjustmentChange("temperature", value)}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            suffix="K"
          />
          <SliderControl
            label="Tint"
            value={adjustments.tint || 0}
            onChange={(value) => onAdjustmentChange("tint", value)}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
          />
          
          <div>
            <span className="text-xs text-gray-400 mb-2 block">Underwater Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {underwaterPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="secondary"
                  size="small"
                  className="text-xs flex-col h-auto py-2"
                  onClick={() => onAdjustmentChange("temperature", preset.temp)}
                >
                  <span>{preset.name}</span>
                  <span className="text-gray-400">{preset.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderToneTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Tone Curve Controls</h4>
        <div className="bg-slate-darker p-4 rounded-lg mb-4">
          <div className="h-32 bg-slate-dark rounded border border-ocean-teal/30 mb-3 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Interactive RGB Curve Editor</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="secondary" size="small" className="text-xs">RGB</Button>
            <Button variant="ghost" size="small" className="text-xs text-red-400">Red</Button>
            <Button variant="ghost" size="small" className="text-xs text-green-400">Green</Button>
            <Button variant="ghost" size="small" className="text-xs text-blue-400">Blue</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button variant="secondary" size="small" className="text-xs">
            <ApperIcon name="Activity" className="w-3 h-3 mr-1" />
            Auto Curve
          </Button>
          <Button variant="secondary" size="small" className="text-xs">
            <ApperIcon name="RotateCcw" className="w-3 h-3 mr-1" />
            Reset Curve
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-dark">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Noise Reduction & Sharpening</h4>
        <div className="space-y-4">
          <SliderControl
            label="Luminance Noise"
            value={adjustments.luminanceNoise || 0}
            onChange={(value) => onAdjustmentChange("luminanceNoise", value)}
            min={0}
            max={100}
            step={1}
            defaultValue={0}
          />
          <SliderControl
            label="Color Noise"
            value={adjustments.colorNoise || 0}
            onChange={(value) => onAdjustmentChange("colorNoise", value)}
            min={0}
            max={100}
            step={1}
            defaultValue={0}
          />
          <SliderControl
            label="Sharpening"
            value={adjustments.sharpening || 0}
            onChange={(value) => onAdjustmentChange("sharpening", value)}
            min={0}
            max={100}
            step={1}
            defaultValue={0}
          />
          <SliderControl
            label="Sharpen Radius"
            value={adjustments.sharpenRadius || 1}
            onChange={(value) => onAdjustmentChange("sharpenRadius", value)}
            min={0.5}
            max={3}
            step={0.1}
            defaultValue={1}
          />
        </div>
      </div>
    </div>
  );

  const renderLocalTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Local Adjustment Tools</h4>
        <div className="grid grid-cols-1 gap-3">
          <Button variant="secondary" className="text-sm justify-start">
            <ApperIcon name="Circle" className="w-4 h-4 mr-2" />
            Radial Adjustment Tool
          </Button>
          <Button variant="secondary" className="text-sm justify-start">
            <ApperIcon name="Move" className="w-4 h-4 mr-2" />
            Linear Gradient Tool
          </Button>
          <Button variant="secondary" className="text-sm justify-start">
            <ApperIcon name="PaintBucket" className="w-4 h-4 mr-2" />
            Brush Tool
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-dark">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Color Range Masking</h4>
        <div className="space-y-4">
          <Button variant="secondary" className="w-full text-sm">
            <ApperIcon name="Eyedropper" className="w-4 h-4 mr-2" />
            Select Color Range
          </Button>
          
          <SliderControl
            label="Tolerance"
            value={adjustments.maskTolerance || 20}
            onChange={(value) => onAdjustmentChange("maskTolerance", value)}
            min={0}
            max={100}
            step={1}
            defaultValue={20}
          />
          <SliderControl
            label="Feather"
            value={adjustments.maskFeather || 10}
            onChange={(value) => onAdjustmentChange("maskFeather", value)}
            min={0}
            max={50}
            step={1}
            defaultValue={10}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="small" className="text-xs">
              <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
              Show Mask
            </Button>
            <Button variant="secondary" size="small" className="text-xs">
              <ApperIcon name="Trash2" className="w-3 h-3 mr-1" />
              Clear Mask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLensTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Lens Correction Tools</h4>
        <div className="space-y-4">
          <SliderControl
            label="Distortion"
            value={adjustments.distortion || 0}
            onChange={(value) => onAdjustmentChange("distortion", value)}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
          />
          <SliderControl
            label="Chromatic Aberration"
            value={adjustments.chromaticAberration || 0}
            onChange={(value) => onAdjustmentChange("chromaticAberration", value)}
            min={0}
            max={100}
            step={1}
            defaultValue={0}
          />
          <SliderControl
            label="Vignette"
            value={adjustments.vignette || 0}
            onChange={(value) => onAdjustmentChange("vignette", value)}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-dark">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Perspective Correction</h4>
        <div className="space-y-4">
          <SliderControl
            label="Horizontal"
            value={adjustments.perspective?.horizontal || 0}
            onChange={(value) => onAdjustmentChange("perspective", { 
              ...adjustments.perspective, 
              horizontal: value 
            })}
            min={-50}
            max={50}
            step={1}
            defaultValue={0}
          />
          <SliderControl
            label="Vertical"
            value={adjustments.perspective?.vertical || 0}
            onChange={(value) => onAdjustmentChange("perspective", { 
              ...adjustments.perspective, 
              vertical: value 
            })}
            min={-50}
            max={50}
            step={1}
            defaultValue={0}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-dark">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Housing Presets</h4>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="secondary" size="small" className="text-xs justify-start">
            Canon Housing + Wide Dome
          </Button>
          <Button variant="secondary" size="small" className="text-xs justify-start">
            Nikon Housing + Macro Port
          </Button>
          <Button variant="secondary" size="small" className="text-xs justify-start">
            Generic Flat Port
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic": return renderBasicTab();
      case "color": return renderColorTab();
      case "tone": return renderToneTab();
      case "local": return renderLocalTab();
      case "lens": return renderLensTab();
      default: return renderBasicTab();
    }
  };

  return (
    <Card className={cn("w-full lg:w-80 h-fit", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <ApperIcon name="Sliders" className="w-5 h-5 text-ocean-teal" />
            <span>Advanced Tools</span>
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
      
      <CardContent>
        <div className="flex space-x-1 mb-6 bg-slate-darker rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-md text-xs transition-colors",
                activeTab === tab.id
                  ? "bg-ocean-teal text-white"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              <ApperIcon name={tab.icon} className="w-3 h-3" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="max-h-[600px] overflow-y-auto pr-2">
          {renderTabContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjustmentPanel;