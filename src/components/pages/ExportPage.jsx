import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Slider from '@/components/atoms/Slider';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';

const ExportPage = ({ className }) => {
  const [exportSettings, setExportSettings] = useState({
    format: 'jpeg',
    quality: 90,
    width: 1920,
    height: 1080,
    colorSpace: 'sRGB',
    watermark: false,
    metadata: true
  });
  
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'jpeg', label: 'JPEG', description: 'Best for photos, smaller file size' },
    { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
    { value: 'tiff', label: 'TIFF', description: 'Professional, largest file size' },
    { value: 'webp', label: 'WebP', description: 'Modern format, good compression' }
  ];

  const colorSpaceOptions = [
    { value: 'sRGB', label: 'sRGB', description: 'Standard web and print' },
    { value: 'AdobeRGB', label: 'Adobe RGB', description: 'Extended color gamut' },
    { value: 'ProPhoto', label: 'ProPhoto RGB', description: 'Widest color range' }
  ];

  const presetSizes = [
    { name: 'Web - Small', width: 1024, height: 683 },
    { name: 'Web - Medium', width: 1920, height: 1080 },
    { name: 'Print - 4x6', width: 1800, height: 1200 },
    { name: 'Print - 8x10', width: 3000, height: 2400 },
    { name: 'Social - Instagram', width: 1080, height: 1080 },
    { name: 'Social - Facebook', width: 1200, height: 630 }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Image exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePresetSize = (preset) => {
    setExportSettings(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }));
  };

  return (
    <div className={cn("min-h-screen bg-slate-darker p-6", className)}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Export</h1>
            <p className="text-gray-400">Prepare your images for sharing or printing</p>
          </div>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-6"
          >
            {isExporting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export Image
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Format Settings */}
          <Card>
            <CardHeader>
              <CardTitle>File Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formatOptions.map((option) => (
                <div key={option.value}>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={option.value}
                      checked={exportSettings.format === option.value}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                  </label>
                </div>
              ))}

              {exportSettings.format === 'jpeg' && (
                <div className="pt-4 border-t border-slate-dark">
                  <Label>Quality: {exportSettings.quality}%</Label>
                  <Slider
                    value={[exportSettings.quality]}
                    onValueChange={([value]) => setExportSettings(prev => ({ ...prev, quality: value }))}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Size Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Image Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={exportSettings.width}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={exportSettings.height}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Preset Sizes</Label>
                <div className="mt-2 grid grid-cols-1 gap-1">
                  {presetSizes.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="ghost"
                      size="small"
                      onClick={() => handlePresetSize(preset)}
                      className="justify-start text-xs"
                    >
                      {preset.name} ({preset.width}×{preset.height})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Color Space</Label>
                <div className="mt-2 space-y-2">
                  {colorSpaceOptions.map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="colorSpace"
                        value={option.value}
                        checked={exportSettings.colorSpace === option.value}
                        onChange={(e) => setExportSettings(prev => ({ ...prev, colorSpace: e.target.value }))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{option.label}</div>
                        <div className="text-xs text-gray-400">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-dark">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportSettings.watermark}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, watermark: e.target.checked }))}
                  />
                  <span className="text-sm text-white">Add watermark</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportSettings.metadata}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, metadata: e.target.checked }))}
                  />
                  <span className="text-sm text-white">Include metadata</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;