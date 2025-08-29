import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import PresetCard from "@/components/molecules/PresetCard";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

const PresetMatcher = ({
  images,
  selectedPresets,
  onPresetsChange,
  onApplyRecommendations,
  onNext,
  loading
}) => {
  const [viewMode, setViewMode] = useState("recommendations");
  const [selectedImages, setSelectedImages] = useState([]);
  const [batchStrength, setBatchStrength] = useState(75);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (selectedPresets && Object.keys(selectedPresets).length > 0) {
      setViewMode("review");
    }
  }, [selectedPresets]);

  const handleImageSelection = (imageId, selected) => {
    if (selected) {
      setSelectedImages(prev => [...prev, imageId]);
    } else {
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    }
  };

  const handlePresetChange = (imageId, preset, strength) => {
    onPresetsChange({
      ...selectedPresets,
      [imageId]: {
        preset,
        strength,
        confidence: 0.9, // User-selected presets have high confidence
        reasons: ["Manually selected"]
      }
    });
  };

  const handleBatchStrengthChange = (newStrength) => {
    setBatchStrength(newStrength);
    
    // Update strength for all selected presets
    const updatedPresets = { ...selectedPresets };
    Object.keys(updatedPresets).forEach(imageId => {
      updatedPresets[imageId] = {
        ...updatedPresets[imageId],
        strength: newStrength
      };
    });
    onPresetsChange(updatedPresets);
  };

  const removePresetFromImage = (imageId) => {
    const updatedPresets = { ...selectedPresets };
    delete updatedPresets[imageId];
    onPresetsChange(updatedPresets);
  };

  const getConditionSummary = () => {
    const conditions = {
      waterClarity: {},
      depth: {},
      lighting: {},
      subjects: {}
    };

    images.forEach(image => {
      if (image.analysis) {
        const { waterClarity, estimatedDepth, lightingCondition, subjectType } = image.analysis;
        conditions.waterClarity[waterClarity] = (conditions.waterClarity[waterClarity] || 0) + 1;
        conditions.depth[estimatedDepth] = (conditions.depth[estimatedDepth] || 0) + 1;
        conditions.lighting[lightingCondition] = (conditions.lighting[lightingCondition] || 0) + 1;
        conditions.subjects[subjectType] = (conditions.subjects[subjectType] || 0) + 1;
      }
    });

    return conditions;
  };

  const renderConditionOverview = () => {
    const summary = getConditionSummary();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="BarChart3" className="w-5 h-5 text-ocean-teal" />
            <span>Condition Analysis Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Water Clarity</h4>
              <div className="space-y-2">
                {Object.entries(summary.waterClarity).map(([condition, count]) => (
                  <div key={condition} className="flex justify-between text-sm">
                    <span className="text-gray-400">{condition}</span>
                    <span className="text-ocean-teal">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Depth Range</h4>
              <div className="space-y-2">
                {Object.entries(summary.depth).map(([depth, count]) => (
                  <div key={depth} className="flex justify-between text-sm">
                    <span className="text-gray-400">{depth.replace(/\([^)]*\)/, '')}</span>
                    <span className="text-ocean-teal">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Lighting</h4>
              <div className="space-y-2">
                {Object.entries(summary.lighting).map(([lighting, count]) => (
                  <div key={lighting} className="flex justify-between text-sm">
                    <span className="text-gray-400">{lighting}</span>
                    <span className="text-ocean-teal">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Subjects</h4>
              <div className="space-y-2">
                {Object.entries(summary.subjects).map(([subject, count]) => (
                  <div key={subject} className="flex justify-between text-sm">
                    <span className="text-gray-400">{subject}</span>
                    <span className="text-ocean-teal">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRecommendationMode = () => (
    <div className="space-y-6">
      {renderConditionOverview()}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Wand2" className="w-5 h-5 text-ocean-teal" />
              <span>AI Preset Recommendations</span>
            </div>
            <Button onClick={onApplyRecommendations} disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                  Generate Recommendations
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-ocean-teal/20 rounded-full">
                <ApperIcon name="Brain" className="w-8 h-8 text-ocean-teal" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI-Powered Preset Matching
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Our intelligent system will analyze each image's underwater conditions and recommend 
              the optimal preset with appropriate strength settings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="p-4 bg-slate-darker rounded-lg">
                <ApperIcon name="Search" className="w-6 h-6 text-ocean-teal mx-auto mb-2" />
                <div className="font-medium text-white">Condition Analysis</div>
                <div className="text-gray-400">Water clarity, depth, lighting</div>
              </div>
              <div className="p-4 bg-slate-darker rounded-lg">
                <ApperIcon name="Target" className="w-6 h-6 text-ocean-teal mx-auto mb-2" />
                <div className="font-medium text-white">Smart Matching</div>
                <div className="text-gray-400">Best preset for each image</div>
              </div>
              <div className="p-4 bg-slate-darker rounded-lg">
                <ApperIcon name="Sliders" className="w-6 h-6 text-ocean-teal mx-auto mb-2" />
                <div className="font-medium text-white">Optimal Strength</div>
                <div className="text-gray-400">Automatic intensity adjustment</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewMode = () => (
    <div className="space-y-6">
      {/* Batch Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Settings" className="w-5 h-5 text-ocean-teal" />
              <span>Preset Recommendations ({Object.keys(selectedPresets).length})</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowPreview(!showPreview)}
              >
                <ApperIcon name={showPreview ? "EyeOff" : "Eye"} className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={onApplyRecommendations}
              >
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300">Batch Strength:</span>
            <input
              type="range"
              min="25"
              max="100"
              value={batchStrength}
              onChange={(e) => handleBatchStrengthChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-ocean-teal font-medium min-w-[60px]">
              {batchStrength}%
            </span>
          </div>
          
          <div className="text-sm text-gray-400">
            Adjusts the intensity of all preset applications simultaneously
          </div>
        </CardContent>
      </Card>

      {/* Image Grid with Preset Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => {
          const presetAssignment = selectedPresets[image.Id];
          const isSelected = selectedImages.includes(image.Id);
          
          return (
            <Card 
              key={image.Id}
              className={cn(
                "transition-all duration-200",
                isSelected ? "border-ocean-teal bg-ocean-teal/5" : "border-slate-dark"
              )}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleImageSelection(image.Id, e.target.checked)}
                      className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal mt-1"
                    />
                    <img 
                      src={image.url}
                      alt={image.filename}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {image.filename}
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>{image.analysis?.waterClarity}</div>
                        <div>{image.analysis?.estimatedDepth}</div>
                        <div>{image.analysis?.lightingCondition}</div>
                      </div>
                    </div>
                  </div>

                  {presetAssignment ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-darker rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-white">
                            {presetAssignment.preset.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removePresetFromImage(image.Id)}
                          >
                            <ApperIcon name="X" className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          {presetAssignment.reasons?.[0] || "AI recommended"}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Strength:</span>
                          <span className="text-xs text-ocean-teal font-medium">
                            {presetAssignment.strength}%
                          </span>
                          <div className="flex-1 bg-slate-dark rounded-full h-1">
                            <div 
                              className="bg-ocean-teal h-1 rounded-full"
                              style={{ width: `${presetAssignment.strength}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 border border-dashed border-slate-dark rounded-lg text-center">
                      <div className="text-sm text-gray-400">No preset assigned</div>
                      <Button
                        variant="ghost"
                        size="small"
                        className="mt-2"
                        onClick={() => {/* Open preset selector */}}
                      >
                        <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
                        Assign Preset
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {Object.keys(selectedPresets).length} of {images.length} images have preset assignments
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedImages(images.map(img => img.Id))}
              >
                Select All Images
              </Button>
              <Button
                onClick={onNext}
                disabled={Object.keys(selectedPresets).length === 0}
              >
                <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
                Start Processing ({Object.keys(selectedPresets).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="py-12">
        <Loading message="Generating intelligent preset recommendations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-slate-darker p-1 rounded-lg">
          <Button
            variant={viewMode === "recommendations" ? "primary" : "ghost"}
            size="small"
            onClick={() => setViewMode("recommendations")}
          >
            <ApperIcon name="Wand2" className="w-4 h-4 mr-2" />
            Recommendations
          </Button>
          <Button
            variant={viewMode === "review" ? "primary" : "ghost"}
            size="small"
            onClick={() => setViewMode("review")}
            disabled={Object.keys(selectedPresets).length === 0}
          >
            <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
            Review ({Object.keys(selectedPresets).length})
          </Button>
        </div>
      </div>

      {viewMode === "recommendations" ? renderRecommendationMode() : renderReviewMode()}
    </div>
  );
};

export default PresetMatcher;