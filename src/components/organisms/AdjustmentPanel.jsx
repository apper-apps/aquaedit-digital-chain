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
    curves: false,
    masking: false
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
    coralEnhancement: 0,
    // Advanced Color Grading
    shadowsTemp: 0,
    midtonesTemp: 0,
    highlightsTemp: 0,
    shadowsTint: 0,
    midtonesTint: 0,
    highlightsTint: 0,
    shadowsSat: 0,
    midtonesSat: 0,
    highlightsSat: 0,
    masterSaturation: 0,
    masterVibrance: 0,
    colorBalance: 0,
    colorHarmony: 0,
    gamutWarning: false,
    // Professional Masking
    activeLuminosityMask: null,
    luminosityPrecision: 8,
    aiSubjectMask: null,
    aiConfidence: 75,
    edgeDetection: 50,
    maskFeathering: 10,
    maskRefinement: 0,
    hueRange: 15,
    satRange: 20,
    valRange: 20
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
    { id: 'curves', name: 'Curves', icon: 'TrendingUp' },
    { id: 'masking', name: 'Masking', icon: 'Layers' }
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
    <div className="space-y-6">
      {/* Three-Way Color Correction */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <ApperIcon name="Palette" className="w-4 h-4 mr-2" />
          Professional Color Grading
        </h5>
        
        {/* Shadows */}
        <div className="mb-4 p-3 bg-slate-darker rounded">
          <h6 className="text-xs font-medium text-gray-400 mb-2">Shadows</h6>
          <div className="grid grid-cols-3 gap-2">
            <SliderControl
              label="Temp"
              value={currentAdjustments.shadowsTemp || 0}
              onChange={(value) => handleAdjustmentChange('shadowsTemp', value)}
              min={-100}
              max={100}
              defaultValue={0}
              suffix="K"
            />
            <SliderControl
              label="Tint"
              value={currentAdjustments.shadowsTint || 0}
              onChange={(value) => handleAdjustmentChange('shadowsTint', value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
            <SliderControl
              label="Sat"
              value={currentAdjustments.shadowsSat || 0}
              onChange={(value) => handleAdjustmentChange('shadowsSat', value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
          </div>
        </div>
        
        {/* Midtones */}
        <div className="mb-4 p-3 bg-slate-darker rounded">
          <h6 className="text-xs font-medium text-gray-400 mb-2">Midtones</h6>
          <div className="grid grid-cols-3 gap-2">
            <SliderControl
              label="Temp"
              value={currentAdjustments.midtonesTemp || 0}
              onChange={(value) => handleAdjustmentChange('midtonesTemp', value)}
              min={-100}
              max={100}
              defaultValue={0}
              suffix="K"
            />
            <SliderControl
              label="Tint"
              value={currentAdjustments.midtonesTint || 0}
              onChange={(value) => handleAdjustmentChange('midtonesTint', value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
            <SliderControl
              label="Sat"
              value={currentAdjustments.midtonesSat || 0}
              onChange={(value) => handleAdjustmentChange('midtonesSat', value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
          </div>
        </div>
        
        {/* Highlights */}
        <div className="mb-4 p-3 bg-slate-darker rounded">
          <h6 className="text-xs font-medium text-gray-400 mb-2">Highlights</h6>
          <div className="grid grid-cols-3 gap-2">
            <SliderControl
              label="Temp"
              value={currentAdjustments.highlightsTemp || 0}
              onChange={(value) => handleAdjustmentChange('highlightsTemp', value)}
              min={-100}
              max={100}
              defaultValue={0}
              suffix="K"
            />
            <SliderControl
              label="Tint"
              value={currentAdjustments.highlightsTint || 0}
              onChange={(value) => handleAdjustmentChange('highlightsTint', value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
            <SliderControl
              label="Sat"
              value={currentAdjustments.highlightsSat || 0}
              onChange={(value) => handleAdjustmentChange('highlightsSat', value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
          </div>
        </div>
      </div>

      {/* Master Controls */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3">Master Controls</h5>
        <SliderControl
          label="Master Saturation"
          value={currentAdjustments.masterSaturation || 0}
          onChange={(value) => handleAdjustmentChange('masterSaturation', value)}
          min={-100}
          max={100}
          defaultValue={0}
        />
        
        <SliderControl
          label="Master Vibrance"
          value={currentAdjustments.masterVibrance || 0}
          onChange={(value) => handleAdjustmentChange('masterVibrance', value)}
          min={-100}
          max={100}
          defaultValue={0}
        />
        
        <SliderControl
          label="Color Harmony"
          value={currentAdjustments.colorHarmony || 0}
          onChange={(value) => handleAdjustmentChange('colorHarmony', value)}
          min={0}
          max={100}
          defaultValue={0}
          suffix="%"
        />
      </div>

      {/* Gamut Warning */}
      <div className="flex items-center justify-between p-3 bg-slate-darker rounded">
        <div className="flex items-center space-x-2">
          <ApperIcon name="AlertTriangle" className="w-4 h-4 text-coral" />
          <span className="text-sm">Gamut Warning</span>
        </div>
        <Button
          variant={currentAdjustments.gamutWarning ? "secondary" : "ghost"}
          size="small"
          className="text-xs"
          onClick={() => handleAdjustmentChange('gamutWarning', !currentAdjustments.gamutWarning)}
        >
          {currentAdjustments.gamutWarning ? 'On' : 'Off'}
        </Button>
      </div>

      {/* Legacy Controls */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3">Basic Color</h5>
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

const renderMaskingAdjustments = () => (
    <div className="space-y-6">
      {/* Professional Message */}
      <div className="p-3 bg-ocean-deep/30 rounded border border-ocean-teal/30">
        <div className="flex items-center space-x-2 mb-2">
          <ApperIcon name="Layers" className="w-4 h-4 text-ocean-teal" />
          <span className="text-sm font-medium text-ocean-teal">Professional Masking Suite</span>
        </div>
        <p className="text-xs text-gray-300">
          Advanced 16-bit precision masking tools with AI-powered underwater subject detection and mathematical color range selection.
        </p>
      </div>

      {/* Luminosity Masking with 16-bit Precision */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <ApperIcon name="Sun" className="w-4 h-4 mr-2" />
          16-bit Luminosity Masking
        </h5>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { name: 'Highlights', range: '200-255' },
            { name: 'Midtones', range: '85-170' },
            { name: 'Shadows', range: '0-85' },
            { name: 'Brights', range: '170-255' },
            { name: 'Darks', range: '0-55' },
            { name: 'Ultra Brights', range: '230-255' }
          ].map((maskType) => (
            <Button
              key={maskType.name}
              variant={currentAdjustments.activeLuminosityMask === maskType.name ? "secondary" : "ghost"}
              size="small"
              className="text-xs h-auto p-2 flex flex-col"
              onClick={() => handleAdjustmentChange('activeLuminosityMask', maskType.name)}
            >
              <span className="font-medium">{maskType.name}</span>
              <span className="text-[10px] text-gray-400">{maskType.range}</span>
            </Button>
          ))}
        </div>
        
        <div className="space-y-2">
          <SliderControl
            label="Mask Precision (bit depth)"
            value={currentAdjustments.luminosityPrecision || 8}
            onChange={(value) => handleAdjustmentChange('luminosityPrecision', value)}
            min={1}
            max={16}
            step={1}
            defaultValue={8}
            suffix=" bit"
          />
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="small" className="text-xs flex-1">
              <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
              Intersect
            </Button>
            <Button variant="ghost" size="small" className="text-xs flex-1">
              <ApperIcon name="Minus" className="w-3 h-3 mr-1" />
              Subtract
            </Button>
          </div>
        </div>
      </div>

      {/* AI Subject Detection for Underwater */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <ApperIcon name="Brain" className="w-4 h-4 mr-2" />
          AI Underwater Subject Detection
        </h5>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { name: 'Fish', confidence: '85%' },
            { name: 'Coral', confidence: '90%' },
            { name: 'Divers', confidence: '95%' },
            { name: 'Equipment', confidence: '88%' },
            { name: 'Kelp/Seaweed', confidence: '82%' },
            { name: 'Water Column', confidence: '70%' }
          ].map((subject) => (
            <Button
              key={subject.name}
              variant={currentAdjustments.aiSubjectMask === subject.name ? "secondary" : "ghost"}
              size="small"
              className="text-xs h-auto p-2 flex flex-col"
              onClick={() => handleAdjustmentChange('aiSubjectMask', subject.name)}
            >
              <span className="font-medium">{subject.name}</span>
              <span className="text-[10px] text-gray-400">{subject.confidence}</span>
            </Button>
          ))}
        </div>
        <SliderControl
          label="Detection Confidence Threshold"
          value={currentAdjustments.aiConfidence || 75}
          onChange={(value) => handleAdjustmentChange('aiConfidence', value)}
          min={50}
          max={95}
          step={5}
          defaultValue={75}
          suffix="%"
        />
      </div>

      {/* Edge-Aware Masking with Refinement */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <ApperIcon name="Scissors" className="w-4 h-4 mr-2" />
          Edge-Aware Masking
        </h5>
        <div className="space-y-2">
          <SliderControl
            label="Edge Detection Strength"
            value={currentAdjustments.edgeDetection || 50}
            onChange={(value) => handleAdjustmentChange('edgeDetection', value)}
            min={0}
            max={100}
            defaultValue={50}
            suffix="%"
          />
          <SliderControl
            label="Feathering (pixel precision)"
            value={currentAdjustments.maskFeathering || 10}
            onChange={(value) => handleAdjustmentChange('maskFeathering', value)}
            min={0}
            max={50}
            defaultValue={10}
            suffix="px"
          />
          <SliderControl
            label="Mask Refinement"
            value={currentAdjustments.maskRefinement || 0}
            onChange={(value) => handleAdjustmentChange('maskRefinement', value)}
            min={-50}
            max={50}
            defaultValue={0}
          />
          
          <div className="flex space-x-2 mt-3">
            <Button variant="ghost" size="small" className="text-xs">Smooth</Button>
            <Button variant="ghost" size="small" className="text-xs">Expand</Button>
            <Button variant="ghost" size="small" className="text-xs">Contract</Button>
            <Button variant="ghost" size="small" className="text-xs">Blur</Button>
          </div>
        </div>
      </div>

      {/* Advanced Color Range Masking (HSV) */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <ApperIcon name="Pipette" className="w-4 h-4 mr-2" />
          Advanced Color Range (HSV)
        </h5>
        <div className="space-y-2 mb-3">
          <SliderControl
            label="Hue Range (degrees)"
            value={currentAdjustments.hueRange || 15}
            onChange={(value) => handleAdjustmentChange('hueRange', value)}
            min={0}
            max={360}
            defaultValue={15}
            suffix="°"
          />
          <SliderControl
            label="Saturation Tolerance"
            value={currentAdjustments.satRange || 20}
            onChange={(value) => handleAdjustmentChange('satRange', value)}
            min={0}
            max={100}
            defaultValue={20}
            suffix="%"
          />
          <SliderControl
            label="Brightness/Value Tolerance"
            value={currentAdjustments.valRange || 20}
            onChange={(value) => handleAdjustmentChange('valRange', value)}
            min={0}
            max={100}
            defaultValue={20}
            suffix="%"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button variant="ghost" size="small" className="text-xs">
            <ApperIcon name="Pipette" className="w-3 h-3 mr-1" />
            Eyedropper
          </Button>
          <Button variant="ghost" size="small" className="text-xs">
            <ApperIcon name="Target" className="w-3 h-3 mr-1" />
            Multi-Sample
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="small" className="text-xs flex-1">Expand</Button>
          <Button variant="ghost" size="small" className="text-xs flex-1">Contract</Button>
          <Button variant="ghost" size="small" className="text-xs flex-1">Smooth</Button>
        </div>
      </div>

      {/* Boolean Mask Operations */}
      <div>
        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <ApperIcon name="Layers" className="w-4 h-4 mr-2" />
          Boolean Mask Operations
        </h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-darker rounded">
            <span className="text-xs">Active Mask Group</span>
            <div className="flex space-x-1">
              <Button variant="ghost" size="small" className="text-xs h-6 px-2">
                <ApperIcon name="Plus" className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="small" className="text-xs h-6 px-2">
                <ApperIcon name="Minus" className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="small" className="text-xs h-6 px-2">
                <ApperIcon name="Circle" className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-400 px-2">
            Combine masks using Add, Subtract, and Intersect operations with mathematical precision
          </div>
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
      case 'masking':
        return renderMaskingAdjustments();
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
<div className="grid grid-cols-5 gap-1 mt-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="small"
              className={cn(
                "text-xs p-2 h-auto flex-col transition-all duration-200",
                activeTab === tab.id && "border border-ocean-teal/50"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <ApperIcon name={tab.icon} className={cn(
                "w-3 h-3 mb-1",
                activeTab === tab.id ? "text-ocean-teal" : "text-gray-400"
              )} />
              <span className={cn(
                activeTab === tab.id ? "text-ocean-teal" : "text-gray-300"
              )}>{tab.name}</span>
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