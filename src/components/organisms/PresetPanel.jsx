import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import PresetCard from '@/components/molecules/PresetCard';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const PresetPanel = ({ onPresetSelect, onPresetCreate, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Presets', icon: 'Grid3x3' },
    { id: 'underwater', name: 'Underwater', icon: 'Waves' },
    { id: 'coral', name: 'Coral Reef', icon: 'Flower' },
    { id: 'fish', name: 'Marine Life', icon: 'Fish' },
    { id: 'macro', name: 'Macro', icon: 'Microscope' },
    { id: 'wide', name: 'Wide Angle', icon: 'Camera' },
    { id: 'custom', name: 'My Presets', icon: 'User' }
  ];

  const samplePresets = [
    {
      id: 1,
      name: 'Tropical Clarity',
      category: 'underwater',
      thumbnail: '/api/placeholder/120/80',
      settings: { exposure: 0.3, contrast: 0.2, saturation: 0.4 }
    },
    {
      id: 2,
      name: 'Coral Pop',
      category: 'coral',
      thumbnail: '/api/placeholder/120/80',
      settings: { vibrance: 0.5, warmth: 0.3, clarity: 0.2 }
    },
    {
      id: 3,
      name: 'Deep Blue',
      category: 'wide',
      thumbnail: '/api/placeholder/120/80',
      settings: { temperature: -0.2, tint: 0.1, shadows: 0.3 }
    }
  ];

  useEffect(() => {
    setPresets(samplePresets);
  }, []);

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Palette" className="w-5 h-5 text-ocean-teal" />
            <span>Presets</span>
          </div>
          <Button 
            variant="ghost" 
            size="small"
            onClick={onPresetCreate}
            title="Create new preset"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Search */}
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
          />
          <Input
            placeholder="Search presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "ghost"}
              size="small"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              <ApperIcon name={category.icon} className="w-3 h-3 mr-1" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {filteredPresets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onClick={() => onPresetSelect(preset)}
                className="cursor-pointer hover:ring-2 hover:ring-ocean-teal/50 transition-all duration-200"
              />
            ))}
          </div>
          
          {filteredPresets.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No presets found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PresetPanel;