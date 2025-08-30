import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SingleImageProcessor = ({
  image,
  selectedPreset,
  isProcessing,
  onStartProcessing,
  processingStatus = ""
}) => {
  const [exportSettings, setExportSettings] = useState({
    format: 'jpeg',
    quality: 95,
    resolution: 'original',
    watermark: false,
    metadata: true
  });

  if (!image) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-dark rounded-full">
              <ApperIcon name="Image" className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Image Loaded</h3>
          <p className="text-gray-400">
            Upload an image and apply adjustments to start processing.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleExportSettingChange = (key, value) => {
    setExportSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Current Image Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Image" className="w-5 h-5 text-ocean-teal" />
            <span>Image Processing Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <img 
              src={image.url}
              alt={image.filename}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-medium text-white">{image.filename}</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <div>{formatFileSize(image.metadata?.size || 0)}</div>
                <div>{image.dimensions?.width || 0} × {image.dimensions?.height || 0}</div>
                <div>{image.format || 'Unknown format'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-sm font-medium", 
                isProcessing ? "text-ocean-teal" : "text-emerald-400"
              )}>
                {isProcessing ? "Processing..." : "Ready"}
              </div>
              {selectedPreset && (
                <div className="text-xs text-gray-400">
                  Preset: {selectedPreset.name}
                </div>
              )}
            </div>
          </div>

          {isProcessing && processingStatus && (
            <div className="mt-4 p-3 bg-slate-darker rounded-lg">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Loader2" className="w-4 h-4 text-ocean-teal animate-spin" />
                <span className="text-sm text-white">{processingStatus}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Settings" className="w-5 h-5 text-coral" />
            <span>Export Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Output Format
                </label>
                <select
                  value={exportSettings.format}
                  onChange={(e) => handleExportSettingChange('format', e.target.value)}
                  className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="tiff">TIFF</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quality: {exportSettings.quality}%
                </label>
                <input
                  type="range"
                  min="75"
                  max="100"
                  value={exportSettings.quality}
                  onChange={(e) => handleExportSettingChange('quality', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Good</span>
                  <span>Best</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolution
                </label>
                <select
                  value={exportSettings.resolution}
                  onChange={(e) => handleExportSettingChange('resolution', e.target.value)}
                  className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                >
                  <option value="original">Original Size</option>
                  <option value="4k">4K (3840×2160)</option>
                  <option value="1080p">Full HD (1920×1080)</option>
                  <option value="720p">HD (1280×720)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportSettings.watermark}
                    onChange={(e) => handleExportSettingChange('watermark', e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <span className="text-gray-300">Add watermark</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportSettings.metadata}
                    onChange={(e) => handleExportSettingChange('metadata', e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <span className="text-gray-300">Preserve metadata</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Play" className="w-5 h-5 text-emerald-400" />
            <span>Processing Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={() => onStartProcessing({ image, preset: selectedPreset, exportSettings })}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Export Image
                </>
              )}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => {/* Open export modal with advanced options */}}
              disabled={isProcessing}
            >
              <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>

          <div className="p-4 bg-slate-darker rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <ApperIcon name="Zap" className="w-5 h-5 text-ocean-teal" />
              <h4 className="font-medium text-white">Processing Features</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Real-time processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Shield" className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Lossless adjustment pipeline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Cpu" className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Hardware acceleration</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="FileImage" className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Multiple format support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Database" className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">EXIF data preservation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Smartphone" className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Mobile optimized</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleImageProcessor;