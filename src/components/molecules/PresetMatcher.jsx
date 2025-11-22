import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import PresetCard from "@/components/molecules/PresetCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";

const SingleImagePresetSelector = ({
  image,
  selectedPreset,
  onPresetChange,
  onApplyRecommendation,
  loading
}) => {
  const [presetStrength, setPresetStrength] = useState(75);
  const [showPreview, setShowPreview] = useState(false);

  // Mock preset library for underwater photography
  const presets = [
    {
      Id: 1,
      name: "Coral Enhancement",
      description: "Boost coral colors and reduce blue cast",
      category: "Coral Reef",
      tags: ["coral", "reef", "shallow"],
      thumbnail: "/api/placeholder/80/60",
      adjustments: { temperature: 20, tint: -10, vibrance: 30, saturation: 15 }
    },
    {
      Id: 2,
      name: "Deep Blue Correction",
      description: "Correct deep water blue cast",
      category: "Deep Water", 
      tags: ["deep", "blue", "correction"],
      thumbnail: "/api/placeholder/80/60",
      adjustments: { temperature: 35, tint: -15, exposure: 0.5, contrast: 20 }
    },
    {
      Id: 3,
      name: "Tropical Fish",
      description: "Enhance tropical fish colors",
      category: "Wildlife",
      tags: ["fish", "tropical", "vibrant"],
      thumbnail: "/api/placeholder/80/60", 
      adjustments: { vibrance: 40, saturation: 20, clarity: 15, shadows: 25 }
    },
    {
      Id: 4,
      name: "Natural Sunlight",
      description: "Natural sunlit shallow water",
      category: "Natural Light",
      tags: ["natural", "sunlight", "shallow"],
      thumbnail: "/api/placeholder/80/60",
      adjustments: { temperature: 10, contrast: 15, highlights: -20, shadows: 30 }
    },
    {
      Id: 5,
      name: "Macro Close-up",
      description: "Perfect for macro underwater shots",
      category: "Macro",
      tags: ["macro", "close-up", "detail"],
      thumbnail: "/api/placeholder/80/60",
      adjustments: { clarity: 25, texture: 20, sharpening: 30, vibrance: 25 }
    },
    {
      Id: 6,
      name: "Cave/Wreck",
      description: "Enhance cave and wreck photography",
      category: "Cave/Wreck",
      tags: ["cave", "wreck", "artificial"],
      thumbnail: "/api/placeholder/80/60",
      adjustments: { exposure: 0.7, shadows: 50, highlights: -30, clarity: 20 }
    }
  ];

  const handlePresetSelect = (preset) => {
    onPresetChange(preset, presetStrength);
  };

  const handleStrengthChange = (newStrength) => {
    setPresetStrength(newStrength);
    if (selectedPreset) {
      onPresetChange(selectedPreset, newStrength);
    }
  };

  const getRecommendedPreset = () => {
    // Simple recommendation based on mock analysis
    if (!image?.analysis) return presets[0];
    
    const { subjectType, estimatedDepth, lightingCondition } = image.analysis;
    
    if (subjectType === "Coral Reef") return presets[0];
    if (estimatedDepth === "Deep (30ft+)") return presets[1];
    if (subjectType === "Tropical Fish") return presets[2];
    if (lightingCondition === "Natural Sunlight") return presets[3];
    if (subjectType === "Macro") return presets[4];
    if (subjectType === "Cave/Wreck") return presets[5];
    
    return presets[0];
  };

  if (!image) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-dark rounded-full">
              <ApperIcon name="Palette" className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Image Loaded</h3>
          <p className="text-gray-400">
Upload a depth photo to see preset recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Wand2" className="w-5 h-5 text-ocean-teal" />
              <span>AI Preset Recommendation</span>
            </div>
            <Button 
              onClick={() => onApplyRecommendation(getRecommendedPreset())}
              disabled={loading}
              size="small"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                  Auto-Apply
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 p-4 bg-slate-darker rounded-lg">
            <img 
              src={getRecommendedPreset().thumbnail}
              alt={getRecommendedPreset().name}
              className="w-16 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-white">{getRecommendedPreset().name}</h4>
              <p className="text-sm text-gray-400 mb-2">{getRecommendedPreset().description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-ocean-teal/20 text-ocean-teal px-2 py-1 rounded">
                  {getRecommendedPreset().category}
                </span>
                <span className="text-xs text-gray-500">
                  Based on: {image.analysis?.subjectType || 'Image analysis'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Selection & Strength */}
      {selectedPreset && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Settings" className="w-5 h-5 text-ocean-teal" />
                <span>Selected Preset</span>
              </div>
              <Button
                variant="secondary" 
                size="small"
                onClick={() => setShowPreview(!showPreview)}
              >
                <ApperIcon name={showPreview ? "EyeOff" : "Eye"} className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-slate-darker rounded-lg">
              <img 
                src={selectedPreset.thumbnail}
                alt={selectedPreset.name}
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-white">{selectedPreset.name}</h4>
                <p className="text-sm text-gray-400">{selectedPreset.description}</p>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={() => onPresetChange(null, 0)}
                className="text-red-400 hover:text-red-300"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Preset Strength</span>
                <span className="text-sm text-ocean-teal font-medium">{presetStrength}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                value={presetStrength}
                onChange={(e) => handleStrengthChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtle</span>
                <span>Strong</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preset Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Palette" className="w-5 h-5 text-coral" />
            <span>Underwater Preset Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <div
                key={preset.Id}
                className={cn(
                  "relative p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105",
                  selectedPreset?.Id === preset.Id
                    ? "border-ocean-teal bg-ocean-teal/5"
                    : "border-slate-dark hover:border-ocean-teal/50"
                )}
                onClick={() => handlePresetSelect(preset)}
              >
                <img 
                  src={preset.thumbnail}
                  alt={preset.name}
                  className="w-full h-16 object-cover rounded mb-2"
                />
                <h4 className="text-sm font-medium text-white mb-1">{preset.name}</h4>
                <p className="text-xs text-gray-400 mb-2">{preset.description}</p>
                <div className="flex flex-wrap gap-1">
                  {preset.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-dark text-gray-300 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {selectedPreset?.Id === preset.Id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-ocean-teal rounded-full flex items-center justify-center">
                      <ApperIcon name="Check" className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-ocean-teal mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-white">Preset Tips</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Start with AI recommendations based on your image analysis</li>
                <li>• Adjust preset strength to match your artistic vision</li>
                <li>• Combine presets with manual adjustments for perfect results</li>
                <li>• Different presets work better for specific underwater conditions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleImagePresetSelector;