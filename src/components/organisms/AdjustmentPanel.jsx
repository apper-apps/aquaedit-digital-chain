import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SliderControl from "@/components/molecules/SliderControl";
import Button from "@/components/atoms/Button";
import CurveEditor from "@/components/molecules/CurveEditor";
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
{ key: "hslReds", label: "Reds", color: "#ef4444", range: [345, 15] },
    { key: "hslOranges", label: "Oranges", color: "#f97316", range: [15, 45] },
    { key: "hslYellows", label: "Yellows", color: "#eab308", range: [45, 75] },
    { key: "hslGreens", label: "Greens", color: "#22c55e", range: [75, 150] },
    { key: "hslCyans", label: "Cyans", color: "#06b6d4", range: [150, 210] },
    { key: "hslBlues", label: "Blues", color: "#3b82f6", range: [210, 270] },
    { key: "hslPurples", label: "Purples", color: "#a855f7", range: [270, 315] },
    { key: "hslMagentas", label: "Magentas", color: "#ec4899", range: [315, 345] }
  ];

const underwaterPresets = [
    { name: "Surface", temp: 0, desc: "5600K" },
    { name: "10ft", temp: -20, desc: "4800K" },
    { name: "30ft", temp: -35, desc: "4200K" },
    { name: "60ft+", temp: -50, desc: "3800K" }
  ];

  const underwaterEnhancementModes = [
    {
      name: "Coral Enhancement",
      key: "coralEnhancementMode",
      description: "Boost red/orange coral colors",
      icon: "Flower2"
    },
    {
      name: "Fish Color Isolation",
      key: "fishColorIsolation", 
      description: "Selective tropical fish enhancement",
      icon: "Fish"
    }
  ];

  // Handle curve changes
  const handleCurveChange = (channel, curve) => {
    onAdjustmentChange(`${channel}Curve`, curve);
  };

  // Handle eyedropper color sampling
  const handleEyedropperSample = (color) => {
    onAdjustmentChange('eyedropperColor', color);
    onAdjustmentChange('selectedColorRange', getColorRangeFromRGB(color));
  };

  // Convert RGB to HSV and determine color range
  const getColorRangeFromRGB = (rgb) => {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      if (max === r) {
        h = ((g - b) / diff + 6) % 6;
      } else if (max === g) {
        h = (b - r) / diff + 2;
      } else {
        h = (r - g) / diff + 4;
      }
    }
    
    const hue = h * 60;
    
    // Find matching color range
    for (const color of hslColors) {
      const [start, end] = color.range;
      if (start > end) { // Wraps around (like red)
        if (hue >= start || hue < end) return color.key;
      } else {
        if (hue >= start && hue < end) return color.key;
      }
    }
    
    return 'hslReds'; // Default
  };

  // Handle underwater enhancement modes
  const handleEnhancementToggle = (mode) => {
    const currentValue = adjustments[mode];
    onAdjustmentChange(mode, !currentValue);
    
    if (mode === 'coralEnhancementMode' && !currentValue) {
      // Auto-boost coral colors when enabled
      onAdjustmentChange('coralBoost', 25);
    }
    
    if (mode === 'fishColorIsolation' && !currentValue) {
      // Auto-enhance fish colors when enabled
      onAdjustmentChange('fishEnhancement', 20);
    }
  };

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
      {/* Underwater Enhancement Modes */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Underwater Enhancement</h4>
        <div className="space-y-2">
          {underwaterEnhancementModes.map((mode) => (
            <div key={mode.key} className="flex items-center justify-between p-2 bg-slate-darker rounded">
              <div className="flex items-center space-x-2">
                <ApperIcon name={mode.icon} className="w-4 h-4 text-ocean-teal" />
                <div>
                  <div className="text-sm text-gray-300">{mode.name}</div>
                  <div className="text-xs text-gray-400">{mode.description}</div>
                </div>
              </div>
              <Button
                variant={adjustments[mode.key] ? "secondary" : "ghost"}
                size="small"
                className="text-xs"
                onClick={() => handleEnhancementToggle(mode.key)}
              >
                {adjustments[mode.key] ? 'ON' : 'OFF'}
              </Button>
            </div>
          ))}
        </div>
        
        {/* Enhancement Controls */}
        {adjustments.coralEnhancementMode && (
          <div className="mt-4 p-3 bg-slate-darker rounded-lg">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Coral Enhancement</h5>
            <SliderControl
              label="Coral Boost"
              value={adjustments.coralBoost || 0}
              onChange={(value) => onAdjustmentChange("coralBoost", value)}
              min={0}
              max={100}
              step={1}
              defaultValue={0}
              className="text-xs"
              suffix="%"
            />
          </div>
        )}

        {adjustments.fishColorIsolation && (
          <div className="mt-4 p-3 bg-slate-darker rounded-lg">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Fish Enhancement</h5>
            <SliderControl
              label="Fish Colors"
              value={adjustments.fishEnhancement || 0}
              onChange={(value) => onAdjustmentChange("fishEnhancement", value)}
              min={0}
              max={100}
              step={1}
              defaultValue={0}
              className="text-xs"
              suffix="%"
            />
          </div>
        )}
      </div>

      {/* Enhanced HSL Color Targeting */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300">HSL Precision Tools</h4>
          <Button
            variant="ghost"
            size="small"
            className="text-xs"
            onClick={() => handleEyedropperSample({ r: 255, g: 0, b: 0 })}
          >
            <ApperIcon name="Pipette" className="w-3 h-3 mr-1" />
            Eyedropper
          </Button>
        </div>
        
        {/* Color Targeting Controls */}
        <div className="mb-4 p-3 bg-slate-darker rounded-lg">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <SliderControl
              label="Tolerance"
              value={adjustments.colorTolerance || 15}
              onChange={(value) => onAdjustmentChange("colorTolerance", value)}
              min={1}
              max={50}
              step={1}
              defaultValue={15}
              className="text-xs"
            />
            <SliderControl
              label="Feather"
              value={adjustments.colorFeather || 10}
              onChange={(value) => onAdjustmentChange("colorFeather", value)}
              min={0}
              max={50}
              step={1}
              defaultValue={10}
              className="text-xs"
            />
          </div>
          
          <SliderControl
            label="Water Cast Correction"
            value={adjustments.waterCastCorrection || 0}
            onChange={(value) => onAdjustmentChange("waterCastCorrection", value)}
            min={-100}
            max={100}
            step={1}
            defaultValue={0}
            className="text-xs"
            suffix="%"
          />
        </div>

        {/* 8-Channel HSL Color Wheel */}
        {hslColors.map((color) => (
          <div key={color.key} className="mb-4 p-3 bg-slate-darker rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: color.color }}></div>
                <span className="text-sm font-medium text-gray-300">{color.label}</span>
                <span className="text-xs text-gray-400">({color.range[0]}°-{color.range[1]}°)</span>
              </div>
              {adjustments.selectedColorRange === color.key && (
                <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
              )}
            </div>
            <div className="space-y-2">
              <SliderControl
                label="Hue Rotation"
                value={adjustments[color.key]?.hue || 0}
                onChange={(value) => handleHSLChange(color.key, "hue", value)}
                min={-180}
                max={180}
                step={1}
                defaultValue={0}
                className="text-xs"
                suffix="°"
              />
              <SliderControl
                label="Saturation"
                value={adjustments[color.key]?.saturation || 0}
                onChange={(value) => handleHSLChange(color.key, "saturation", value)}
                min={-100}
                max={200}
                step={1}
                defaultValue={0}
                className="text-xs"
                suffix="%"
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
                suffix="%"
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
        <h4 className="text-sm font-medium text-gray-300 mb-3">Advanced Curve Editor</h4>
        
        {/* Interactive Curve Editor */}
        <CurveEditor
          curves={{
            master: adjustments.masterCurve,
            rgb: adjustments.rgbCurve,
            red: adjustments.redCurve,
            green: adjustments.greenCurve,
            blue: adjustments.blueCurve
          }}
          onCurveChange={handleCurveChange}
          activeChannel={adjustments.activeCurveChannel || 'rgb'}
          onChannelChange={(channel) => onAdjustmentChange('activeCurveChannel', channel)}
          showHistogram={adjustments.showHistogram}
          histogram={null} // TODO: Generate from current image
        />
        
        {/* Advanced Curve Controls */}
        <div className="mt-4 space-y-4">
          <div className="p-3 bg-slate-darker rounded-lg">
            <h5 className="text-sm font-medium text-gray-300 mb-3">Tone Mapping Controls</h5>
            <div className="grid grid-cols-2 gap-3">
              <SliderControl
                label="Shadow Clipping"
                value={adjustments.shadowClipping || 0}
                onChange={(value) => onAdjustmentChange("shadowClipping", value)}
                min={0}
                max={100}
                step={1}
                defaultValue={0}
                className="text-xs"
              />
              <SliderControl
                label="Highlight Clipping"
                value={adjustments.highlightClipping || 0}
                onChange={(value) => onAdjustmentChange("highlightClipping", value)}
                min={0}
                max={100}
                step={1}
                defaultValue={0}
                className="text-xs"
              />
            </div>
            
            <SliderControl
              label="Midtone Contrast"
              value={adjustments.midtoneContrast || 0}
              onChange={(value) => onAdjustmentChange("midtoneContrast", value)}
              min={-100}
              max={100}
              step={1}
              defaultValue={0}
              className="text-xs mt-3"
            />
          </div>

          {/* Curve Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={adjustments.showHistogram ? "secondary" : "ghost"}
                size="small"
                className="text-xs"
                onClick={() => onAdjustmentChange('showHistogram', !adjustments.showHistogram)}
              >
                <ApperIcon name="BarChart3" className="w-3 h-3 mr-1" />
                Histogram
              </Button>
              <Button
                variant={adjustments.showBeforeAfter ? "secondary" : "ghost"}
                size="small"
                className="text-xs"
                onClick={() => onAdjustmentChange('showBeforeAfter', !adjustments.showBeforeAfter)}
              >
                <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
                Compare
              </Button>
            </div>
            <Button
              variant="ghost"
              size="small"
              className="text-xs"
              onClick={() => onAdjustmentChange('curveSmoothingEnabled', !adjustments.curveSmoothingEnabled)}
            >
              <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
              {adjustments.curveSmoothingEnabled ? 'Disable' : 'Enable'} Smoothing
            </Button>
          </div>
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