import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

const DuplicateDetection = ({
  images,
  duplicates,
  onDuplicatesChange,
  settings,
  onSettingsChange,
  onDetect,
  onNext,
  loading
}) => {
  const [selectedDuplicates, setSelectedDuplicates] = useState([]);
  const [resolutionStrategy, setResolutionStrategy] = useState("keep_larger");

  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleDuplicateSelection = (duplicateId, selected) => {
    if (selected) {
      setSelectedDuplicates(prev => [...prev, duplicateId]);
    } else {
      setSelectedDuplicates(prev => prev.filter(id => id !== duplicateId));
    }
  };

  const handleResolveDuplicates = () => {
    const resolved = selectedDuplicates.map(dupId => {
      const duplicate = duplicates.find(d => d.id === dupId);
      if (!duplicate) return null;

      let keepImage, removeImage;
      
      switch (resolutionStrategy) {
        case "keep_larger":
          keepImage = duplicate.images[0].size >= duplicate.images[1].size ? 
                     duplicate.images[0] : duplicate.images[1];
          removeImage = duplicate.images[0].size >= duplicate.images[1].size ? 
                       duplicate.images[1] : duplicate.images[0];
          break;
        case "keep_newer":
          keepImage = new Date(duplicate.images[0].metadata.lastModified) >= new Date(duplicate.images[1].metadata.lastModified) ? 
                     duplicate.images[0] : duplicate.images[1];
          removeImage = new Date(duplicate.images[0].metadata.lastModified) >= new Date(duplicate.images[1].metadata.lastModified) ? 
                       duplicate.images[1] : duplicate.images[0];
          break;
        case "manual":
        default:
          return { duplicate, action: "manual_review" };
      }
      
      return {
        duplicate,
        keep: keepImage,
        remove: removeImage,
        action: "resolved"
      };
    }).filter(Boolean);

    console.log("Resolved duplicates:", resolved);
    
    // Remove resolved duplicates from the list
    const remainingDuplicates = duplicates.filter(d => !selectedDuplicates.includes(d.id));
    onDuplicatesChange(remainingDuplicates);
    setSelectedDuplicates([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="py-12">
        <Loading message="Scanning for duplicate images..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Detection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Search" className="w-5 h-5 text-ocean-teal" />
            <span>Duplicate Detection Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Similarity Threshold: {settings.threshold}%
                </label>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={settings.threshold}
                  onChange={(e) => handleSettingChange('threshold', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Less Strict</span>
                  <span>More Strict</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.checkMetadata}
                    onChange={(e) => handleSettingChange('checkMetadata', e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <span className="text-gray-300">Compare metadata (size, dimensions)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.checkVisualSimilarity}
                    onChange={(e) => handleSettingChange('checkVisualSimilarity', e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <span className="text-gray-300">Analyze visual similarity (slower)</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolution Strategy
                </label>
                <select
                  value={resolutionStrategy}
                  onChange={(e) => setResolutionStrategy(e.target.value)}
                  className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                >
                  <option value="keep_larger">Keep larger file</option>
                  <option value="keep_newer">Keep newer file</option>
                  <option value="manual">Manual review required</option>
                </select>
              </div>

              <Button onClick={onDetect} className="w-full">
                <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                Scan for Duplicates ({images.length} images)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duplicate Results */}
      {duplicates.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Copy" className="w-5 h-5 text-amber-500" />
                <span>Potential Duplicates ({duplicates.length})</span>
              </CardTitle>
              <div className="text-sm text-gray-400">
                {selectedDuplicates.length} selected
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {duplicates.map((duplicate) => (
                <div 
                  key={duplicate.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    selectedDuplicates.includes(duplicate.id)
                      ? "border-amber-500 bg-amber-500/5"
                      : "border-slate-dark bg-slate-darker"
                  )}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedDuplicates.includes(duplicate.id)}
                      onChange={(e) => handleDuplicateSelection(duplicate.id, e.target.checked)}
                      className="w-4 h-4 text-amber-500 bg-slate-darker border-slate-dark rounded focus:ring-amber-500 mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="AlertTriangle" className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-white">
                            {duplicate.similarity}% similarity
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{duplicate.reason}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {duplicate.images.map((image, index) => (
                          <div key={image.Id} className="flex space-x-3">
                            <img 
                              src={image.url}
                              alt={image.filename}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="text-sm font-medium text-white truncate">
                                {image.filename}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatFileSize(image.size)}
                              </div>
                              <div className="text-xs text-gray-400">
                                {image.metadata?.width}×{image.metadata?.height}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(image.metadata?.lastModified).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedDuplicates.length > 0 && (
              <div className="flex space-x-3 pt-4 border-t border-slate-dark">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedDuplicates(duplicates.map(d => d.id))}
                >
                  Select All
                </Button>
                <Button
                  onClick={handleResolveDuplicates}
                  className="flex-1"
                >
                  <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                  Resolve Selected ({selectedDuplicates.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {duplicates.length === 0 && images.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-emerald-500/20 rounded-full">
                <ApperIcon name="CheckCircle" className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Duplicates Found</h3>
            <p className="text-gray-400 mb-4">
              All {images.length} images appear to be unique based on your detection settings.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-dark">
        <div className="text-sm text-gray-400">
          {duplicates.length > 0 
            ? `${duplicates.length} potential duplicates found`
            : "Ready to proceed to preset matching"
          }
        </div>
        <Button onClick={onNext}>
          <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
          Continue to Presets
        </Button>
      </div>
    </div>
  );
};

export default DuplicateDetection;