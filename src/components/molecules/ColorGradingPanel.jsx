import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import SliderControl from '@/components/molecules/SliderControl';
import { cn } from '@/utils/cn';

const ColorGradingPanel = ({ 
  colorGrading = {}, 
  onColorGradingChange,
  onReset,
  className 
}) => {
  const [activeWheel, setActiveWheel] = useState('shadows');

  const defaultGrading = {
    shadows: { lift: [0, 0, 0], gamma: [0, 0, 0], gain: [0, 0, 0] },
    midtones: { lift: [0, 0, 0], gamma: [0, 0, 0], gain: [0, 0, 0] },
    highlights: { lift: [0, 0, 0], gamma: [0, 0, 0], gain: [0, 0, 0] },
    master: { saturation: 0, vibrance: 0, contrast: 0 }
  };

  const currentGrading = { ...defaultGrading, ...colorGrading };

  const handleWheelChange = useCallback((wheel, control, axis, value) => {
    const newGrading = { ...currentGrading };
    if (!newGrading[wheel]) newGrading[wheel] = defaultGrading[wheel];
    if (!newGrading[wheel][control]) newGrading[wheel][control] = [0, 0, 0];
    
    newGrading[wheel][control][axis] = value;
    onColorGradingChange?.(newGrading);
  }, [currentGrading, onColorGradingChange]);

  const handleMasterChange = useCallback((control, value) => {
    const newGrading = { ...currentGrading };
    if (!newGrading.master) newGrading.master = defaultGrading.master;
    
    newGrading.master[control] = value;
    onColorGradingChange?.(newGrading);
  }, [currentGrading, onColorGradingChange]);

  const resetAll = useCallback(() => {
    onReset?.();
  }, [onReset]);

  const wheelTabs = [
    { id: 'shadows', name: 'Shadows', icon: 'Moon' },
    { id: 'midtones', name: 'Midtones', icon: 'Sun' },
    { id: 'highlights', name: 'Highlights', icon: 'Lightbulb' }
  ];

  const controlTypes = [
    { id: 'lift', name: 'Lift', description: 'Adjust shadows/blacks' },
    { id: 'gamma', name: 'Gamma', description: 'Adjust midtones' },
    { id: 'gain', name: 'Gain', description: 'Adjust highlights/whites' }
  ];

  const renderColorWheel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-300 capitalize">{activeWheel} Control</h5>
        <div className="flex space-x-1">
          {wheelTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeWheel === tab.id ? "secondary" : "ghost"}
              size="small"
              className="text-xs"
              onClick={() => setActiveWheel(tab.id)}
            >
              {tab.name}
            </Button>
          ))}
        </div>
      </div>

      {controlTypes.map((control) => (
        <div key={control.id} className="p-3 bg-slate-darker rounded">
          <div className="flex items-center justify-between mb-3">
            <h6 className="text-xs font-medium text-gray-400">{control.name}</h6>
            <span className="text-xs text-gray-500">{control.description}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <SliderControl
              label="Red"
              value={currentGrading[activeWheel]?.[control.id]?.[0] || 0}
              onChange={(value) => handleWheelChange(activeWheel, control.id, 0, value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
            <SliderControl
              label="Green"
              value={currentGrading[activeWheel]?.[control.id]?.[1] || 0}
              onChange={(value) => handleWheelChange(activeWheel, control.id, 1, value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
            <SliderControl
              label="Blue"
              value={currentGrading[activeWheel]?.[control.id]?.[2] || 0}
              onChange={(value) => handleWheelChange(activeWheel, control.id, 2, value)}
              min={-100}
              max={100}
              defaultValue={0}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderMasterControls = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-medium text-gray-300">Master Controls</h5>
      
      <SliderControl
        label="Master Saturation"
        value={currentGrading.master?.saturation || 0}
        onChange={(value) => handleMasterChange('saturation', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Master Vibrance"
        value={currentGrading.master?.vibrance || 0}
        onChange={(value) => handleMasterChange('vibrance', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
      
      <SliderControl
        label="Master Contrast"
        value={currentGrading.master?.contrast || 0}
        onChange={(value) => handleMasterChange('contrast', value)}
        min={-100}
        max={100}
        defaultValue={0}
      />
    </div>
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <ApperIcon name="Palette" className="w-4 h-4 text-ocean-teal" />
            <span>Professional Color Grading</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="small"
            onClick={resetAll}
            className="text-xs"
            title="Reset all color grading"
          >
            <ApperIcon name="RotateCcw" className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderColorWheel()}
        {renderMasterControls()}
      </CardContent>
    </Card>
  );
};

export default ColorGradingPanel;