import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import Slider from '@/components/atoms/Slider';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const ProfessionalMaskingPanel = ({ 
  maskSettings = {}, 
  onMaskChange,
  onMaskCreate,
  onMaskDelete,
  activeMasks = [],
  className
}) => {
  const [activeTool, setActiveTool] = useState('luminosity');
  const [maskHistory, setMaskHistory] = useState([]);
  const [selectedMask, setSelectedMask] = useState(null);

  // Luminosity mask presets for 16-bit precision
  const luminosityMasks = useMemo(() => [
    { name: 'Highlights', range: [200, 255], color: '#ffffff' },
    { name: 'Midtones', range: [85, 170], color: '#888888' },
    { name: 'Shadows', range: [0, 85], color: '#333333' },
    { name: 'Brights', range: [170, 255], color: '#cccccc' },
    { name: 'Darks', range: [0, 55], color: '#111111' },
    { name: 'Ultra Brights', range: [230, 255], color: '#f0f0f0' }
  ], []);

  // AI subject detection categories trained for underwater scenes
  const aiSubjects = useMemo(() => [
    { name: 'Fish', icon: 'Fish', confidence: 0.85 },
    { name: 'Coral', icon: 'TreePine', confidence: 0.90 },
    { name: 'Divers', icon: 'User', confidence: 0.95 },
    { name: 'Equipment', icon: 'Camera', confidence: 0.88 },
    { name: 'Kelp/Seaweed', icon: 'Leaf', confidence: 0.82 },
    { name: 'Rocks/Substrate', icon: 'Mountain', confidence: 0.75 },
    { name: 'Water Column', icon: 'Waves', confidence: 0.70 }
  ], []);

  const handleMaskCreate = useCallback((maskType, settings) => {
    const newMask = {
      id: Date.now(),
      type: maskType,
      settings,
      opacity: 100,
      blendMode: 'normal',
      inverted: false,
      feathering: 0
    };
    
    onMaskCreate?.(newMask);
    setMaskHistory(prev => [...prev, { action: 'create', mask: newMask }]);
  }, [onMaskCreate]);

  const handleLuminosityMask = useCallback((maskPreset) => {
    const settings = {
      type: 'luminosity',
      range: maskPreset.range,
      precision: 16, // 16-bit precision
      name: maskPreset.name
    };
    handleMaskCreate('luminosity', settings);
  }, [handleMaskCreate]);

  const handleAISubjectDetection = useCallback((subject) => {
    const settings = {
      type: 'ai_subject',
      subject: subject.name,
      confidence: subject.confidence,
      refinement: 'edge_aware',
      underwater_optimized: true
    };
    handleMaskCreate('ai_subject', settings);
  }, [handleMaskCreate]);

  const renderLuminosityMasking = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">16-bit Luminosity Masks</h4>
        <Button variant="ghost" size="small" className="text-xs">
          <ApperIcon name="Settings" className="w-3 h-3 mr-1" />
          Advanced
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {luminosityMasks.map((mask) => (
          <Button
            key={mask.name}
            variant="ghost"
            size="small"
            className="h-auto p-3 flex flex-col items-start"
            onClick={() => handleLuminosityMask(mask)}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: mask.color }}
              />
              <span className="text-xs font-medium">{mask.name}</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {mask.range[0]}-{mask.range[1]}
            </span>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Mask Combinations</Label>
          <div className="flex space-x-2 mt-1">
            <Button variant="ghost" size="small" className="text-xs">Add</Button>
            <Button variant="ghost" size="small" className="text-xs">Subtract</Button>
            <Button variant="ghost" size="small" className="text-xs">Intersect</Button>
            <Button variant="ghost" size="small" className="text-xs">Exclude</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISubjectDetection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">AI Subject Detection</h4>
        <Button variant="ghost" size="small" className="text-xs">
          <ApperIcon name="Brain" className="w-3 h-3 mr-1" />
          Retrain
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {aiSubjects.map((subject) => (
          <Button
            key={subject.name}
            variant="ghost"
            size="small"
            className="h-auto p-3 flex items-center justify-between"
            onClick={() => handleAISubjectDetection(subject)}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name={subject.icon} className="w-4 h-4 text-ocean-teal" />
              <span className="text-xs font-medium">{subject.name}</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {Math.round(subject.confidence * 100)}%
            </span>
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Detection Settings</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Confidence Threshold</span>
            <span className="text-xs text-white">75%</span>
          </div>
          <Slider
            min={50}
            max={95}
            step={5}
            defaultValue={75}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  const renderEdgeAwareMasking = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Edge-Aware Masking</h4>
        <Button variant="ghost" size="small" className="text-xs">
          <ApperIcon name="Scissors" className="w-3 h-3 mr-1" />
          Refine
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Edge Detection Strength</Label>
          <Slider
            min={0}
            max={100}
            defaultValue={50}
            className="w-full mt-1"
          />
        </div>
        
        <div>
          <Label className="text-xs">Feathering (pixels)</Label>
          <Slider
            min={0}
            max={50}
            defaultValue={10}
            className="w-full mt-1"
          />
        </div>
        
        <div>
          <Label className="text-xs">Mask Refinement</Label>
          <div className="flex space-x-2 mt-1">
            <Button variant="ghost" size="small" className="text-xs">Smooth</Button>
            <Button variant="ghost" size="small" className="text-xs">Expand</Button>
            <Button variant="ghost" size="small" className="text-xs">Contract</Button>
            <Button variant="ghost" size="small" className="text-xs">Blur</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderColorRangeMasking = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Color Range (HSV)</h4>
        <Button variant="ghost" size="small" className="text-xs">
          <ApperIcon name="Pipette" className="w-3 h-3 mr-1" />
          Eyedropper
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Hue Range</Label>
          <Slider
            min={0}
            max={360}
            defaultValue={15}
            className="w-full mt-1"
          />
        </div>
        
        <div>
          <Label className="text-xs">Saturation Tolerance</Label>
          <Slider
            min={0}
            max={100}
            defaultValue={20}
            className="w-full mt-1"
          />
        </div>
        
        <div>
          <Label className="text-xs">Value/Brightness Tolerance</Label>
          <Slider
            min={0}
            max={100}
            defaultValue={20}
            className="w-full mt-1"
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="ghost" size="small" className="text-xs flex-1">
            <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
            Expand
          </Button>
          <Button variant="ghost" size="small" className="text-xs flex-1">
            <ApperIcon name="Minus" className="w-3 h-3 mr-1" />
            Contract
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMaskHistory = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Mask History</h4>
        <Button variant="ghost" size="small" className="text-xs">
          <ApperIcon name="RotateCcw" className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {maskHistory.slice(-5).map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-slate-darker rounded text-xs"
          >
            <span>{entry.action}: {entry.mask?.settings?.name || entry.mask?.settings?.subject || 'Mask'}</span>
            <Button variant="ghost" size="small" className="text-xs h-6 px-2">
              Restore
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const toolTabs = [
    { id: 'luminosity', name: 'Luminosity', icon: 'Sun' },
    { id: 'ai_subject', name: 'AI Subject', icon: 'Brain' },
    { id: 'edge_aware', name: 'Edge Aware', icon: 'Scissors' },
    { id: 'color_range', name: 'Color Range', icon: 'Pipette' }
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <ApperIcon name="Layers" className="w-4 h-4 text-ocean-teal" />
          <span>Professional Masking</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-1">
          {toolTabs.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "secondary" : "ghost"}
              size="small"
              className="text-xs p-2 h-auto flex-col"
              onClick={() => setActiveTool(tool.id)}
            >
              <ApperIcon name={tool.icon} className="w-3 h-3 mb-1" />
              <span>{tool.name}</span>
            </Button>
          ))}
        </div>

        {/* Tool Content */}
        <div className="min-h-[200px]">
          {activeTool === 'luminosity' && renderLuminosityMasking()}
          {activeTool === 'ai_subject' && renderAISubjectDetection()}
          {activeTool === 'edge_aware' && renderEdgeAwareMasking()}
          {activeTool === 'color_range' && renderColorRangeMasking()}
        </div>

        {/* Active Masks */}
        {activeMasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Active Masks</h4>
            <div className="space-y-1">
              {activeMasks.map((mask, index) => (
                <div
                  key={mask.id || index}
                  className="flex items-center justify-between p-2 bg-slate-darker rounded"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={mask.type === 'luminosity' ? 'Sun' : 
                            mask.type === 'ai_subject' ? 'Brain' : 
                            mask.type === 'edge_aware' ? 'Scissors' : 'Pipette'} 
                      className="w-3 h-3" 
                    />
                    <span className="text-xs">{mask.name || `${mask.type} mask`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{mask.opacity}%</span>
                    <Button variant="ghost" size="small" className="text-xs h-6 px-2">
                      <ApperIcon name="X" className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mask History */}
        {renderMaskHistory()}
      </CardContent>
    </Card>
  );
};

export default ProfessionalMaskingPanel;