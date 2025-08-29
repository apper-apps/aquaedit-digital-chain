import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SliderControl from "@/components/molecules/SliderControl";
import CurveEditor from "@/components/molecules/CurveEditor";
import { cn } from "@/utils/cn";

const AdjustmentPanel = ({ 
  adjustments = {}, 
  onAdjustmentChange, 
  onReset, 
  curves = {}, 
  onCurveChange,
  histogram = null,
  className 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [activeCurveChannel, setActiveCurveChannel] = useState('rgb');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    color: false,
    underwater: false,
    curves: false
  });

  // Default adjustment values
  const defaultAdjustments = useMemo(() => ({
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    contrast: 0,
    brightness: 0,
    vibrance: 0,
    saturation: 0,
    clarity: 0,
    dehaze: 0,
    temperature: 0,
    tint: 0,
    waterClarity: 0,
    blueRemoval: 0,
    greenRemoval: 0,
    depthCompensation: 0,
    coralEnhancement: 0
  }), []);

  // Merge with defaults
  const currentAdjustments = useMemo(() => ({
    ...defaultAdjustments,
    ...adjustments
  }), [defaultAdjustments, adjustments]);

  // Underwater presets
  const underwaterPresets = useMemo(() => [
    {
      name: "Shallow Water",
      description: "For 0-10m depth photos",
      adjustments: {
        exposure: 0.3,
        highlights: -20,
        shadows: 15,
        contrast: 10,
        vibrance: 20,
        temperature: 200,
        tint: -10,
        waterClarity: 15,
        blueRemoval: 10
      }
    },
    {
      name: "Deep Blue",
      description: "For 10-30m depth photos", 
      adjustments: {
        exposure: 0.5,
        highlights: -30,
        shadows: 25,
        contrast: 15,
        vibrance: 30,
        temperature: 400,
        tint: -15,
        waterClarity: 25,
        blueRemoval: 20,
        depthCompensation: 15
      }
    },
    {
      name: "Cave/Wreck",
      description: "High contrast for caves",
      adjustments: {
        exposure: 0.7,
        highlights: -40,
        shadows: 35,
        contrast: 25,
        clarity: 20,
        vibrance: 25,
        temperature: 300,
        waterClarity: 30,
        blueRemoval: 15
      }
    },
    {
      name: "Coral Garden",
      description: "Enhance coral colors",
      adjustments: {
        exposure: 0.2,
        highlights: -15,
        shadows: 10,
        vibrance: 40,
        saturation: 10,
        temperature: 150,
        coralEnhancement: 25,
        waterClarity: 10
      }
    }
  ], []);

  const handleAdjustmentChange = useCallback((key, value) => {
    onAdjustmentChange?.(key, value);
  }, [onAdjustmentChange]);

  const handleSectionToggle = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const applyPreset = useCallback((preset) => {
    if (preset.adjustments) {
      Object.entries(preset.adjustments).forEach(([key, value]) => {
        handleAdjustmentChange(key, value);
      });
    }
  }, [handleAdjustmentChange]);

  const resetAllAdjustments = useCallback(() => {
    onReset?.();
  }, [onReset]);

  const tabs = [
    { id: 'basic', name: 'Basic', icon: 'Settings' },
    { id: 'color', name: 'Color', icon: 'Palette' },
    { id: 'underwater', name: 'Underwater', icon: 'Waves' },
    { id: 'curves', name: 'Curves', icon: 'TrendingUp' }
  ];

  const renderBasicAdjustments = () => (
    <div className="space-y-4">
      <SliderControl
        label="Exposure"
        value={currentAdjustments.exposure}
        onChange={(value) => handleAdjustmentChange('exposure', value)}
        min={-2}
        max={2}
        step={0.1}
        defaultValue={0}
      />
      
      <SliderControl
        label="Highlights"
        value={currentAdjustments.highlights}
        onChange={(value) => handleAdjustmentChange('highlights', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Shadows"
        value={currentAdjustments.shadows}
        onChange={(value) => handleAdjustmentChange('shadows', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Whites"
        value={currentAdjustments.whites}
        onChange={(value) => handleAdjustmentChange('whites', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Blacks"
        value={currentAdjustments.blacks}
        onChange={(value) => handleAdjustmentChange('blacks', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Contrast"
        value={currentAdjustments.contrast}
        onChange={(value) => handleAdjustmentChange('contrast', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Brightness"
        value={currentAdjustments.brightness}
        onChange={(value) => handleAdjustmentChange('brightness', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
    </div>
  );

  const renderColorAdjustments = () => (
    <div className="space-y-4">
      <SliderControl
        label="Temperature"
        value={currentAdjustments.temperature}
        onChange={(value) => handleAdjustmentChange('temperature', value)}
        min={-1000}
        max={1000}
        step={10}
        defaultValue={0}
        suffix="K"
      />
      
      <SliderControl
        label="Tint"
        value={currentAdjustments.tint}
        onChange={(value) => handleAdjustmentChange('tint', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Vibrance"
        value={currentAdjustments.vibrance}
        onChange={(value) => handleAdjustmentChange('vibrance', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Saturation"
        value={currentAdjustments.saturation}
        onChange={(value) => handleAdjustmentChange('saturation', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Clarity"
        value={currentAdjustments.clarity}
        onChange={(value) => handleAdjustmentChange('clarity', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Dehaze"
        value={currentAdjustments.dehaze}
        onChange={(value) => handleAdjustmentChange('dehaze', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
    </div>
  );

  const renderUnderwaterAdjustments = () => (
    <div className="space-y-4">
      <SliderControl
        label="Water Clarity"
        value={currentAdjustments.waterClarity}
        onChange={(value) => handleAdjustmentChange('waterClarity', value)}
        min={-50}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Blue Cast Removal"
        value={currentAdjustments.blueRemoval}
        onChange={(value) => handleAdjustmentChange('blueRemoval', value)}
        min={0}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Green Cast Removal"
        value={currentAdjustments.greenRemoval}
        onChange={(value) => handleAdjustmentChange('greenRemoval', value)}
        min={0}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Depth Compensation"
        value={currentAdjustments.depthCompensation}
        onChange={(value) => handleAdjustmentChange('depthCompensation', value)}
        min={0}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Coral Enhancement"
        value={currentAdjustments.coralEnhancement}
        onChange={(value) => handleAdjustmentChange('coralEnhancement', value)}
        min={0}
        max={100}
        defaultValue={0}
      />
      
      <div className="pt-4">
        <h5 className="text-sm font-medium text-gray-300 mb-3">Underwater Presets</h5>
        <div className="grid grid-cols-2 gap-2">
          {underwaterPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="ghost"
              size="small"
              className="text-xs p-3 h-auto flex-col items-start"
              onClick={() => applyPreset(preset)}
            >
              <span className="font-medium text-left">{preset.name}</span>
              <span className="text-gray-400 text-[10px] text-left mt-1">
                {preset.description}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurveAdjustments = () => (
    <div className="space-y-4">
      <CurveEditor
        curves={curves}
        onCurveChange={onCurveChange}
        activeChannel={activeCurveChannel}
        onChannelChange={setActiveCurveChannel}
        histogram={histogram}
        showHistogram={true}
      />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicAdjustments();
      case 'color':
        return renderColorAdjustments();
      case 'underwater':
        return renderUnderwaterAdjustments();
      case 'curves':
        return renderCurveAdjustments();
      default:
        return renderBasicAdjustments();
    }
  };

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Adjustments</CardTitle>
          <Button
            variant="ghost"
            size="small"
            onClick={resetAllAdjustments}
            className="text-xs"
            title="Reset all adjustments"
          >
            <ApperIcon name="RotateCcw" className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 mt-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="small"
              className="text-xs p-2 h-auto flex-col"
              onClick={() => setActiveTab(tab.id)}
            >
              <ApperIcon name={tab.icon} className="w-3 h-3 mb-1" />
              <span>{tab.name}</span>
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="max-h-96 overflow-y-auto pr-2">
          {renderTabContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjustmentPanel;