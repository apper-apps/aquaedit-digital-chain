import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ImageAnalysis = ({ image, analysis }) => {
  if (!image) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-dark rounded-full">
              <ApperIcon name="Brain" className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Image Loaded</h3>
          <p className="text-gray-400">
            Upload an underwater photo to see AI-powered condition analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mock analysis data if not provided
  const mockAnalysis = analysis || {
    waterClarity: "Crystal Clear",
    estimatedDepth: "Shallow (10-30ft)",
    lightingCondition: "Natural Sunlight",
    subjectType: "Coral Reef",
    colorCastSeverity: { level: "Moderate", dominantCast: "Blue-Green" },
    backscatterDensity: { level: "Low" },
    confidence: 0.85,
    recommendedAdjustments: {
      temperature: 15,
      tint: -8,
      exposure: 0.3,
      contrast: 20,
      highlights: -25,
      shadows: 30,
      vibrance: 25,
      saturation: 10
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "text-emerald-400";
    if (confidence >= 0.6) return "text-amber-400";
    return "text-red-400";
  };

  const getColorCastColor = (level) => {
    switch (level) {
      case "Severe": return "text-red-400";
      case "Moderate": return "text-amber-400";
      case "Mild": return "text-emerald-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Brain" className="w-5 h-5 text-ocean-teal" />
            <span>AI Underwater Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Underwater Conditions</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Water Clarity:</span>
                  <span className="text-ocean-teal font-medium">{mockAnalysis.waterClarity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Estimated Depth:</span>
                  <span className="text-ocean-teal font-medium">{mockAnalysis.estimatedDepth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Lighting:</span>
                  <span className="text-ocean-teal font-medium">{mockAnalysis.lightingCondition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subject Type:</span>
                  <span className="text-ocean-teal font-medium">{mockAnalysis.subjectType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-white">Image Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Color Cast:</span>
                  <div className="text-right">
                    <span className={`font-medium ${getColorCastColor(mockAnalysis.colorCastSeverity?.level)}`}>
                      {mockAnalysis.colorCastSeverity?.level || 'Unknown'}
                    </span>
                    <div className="text-xs text-gray-500">
                      {mockAnalysis.colorCastSeverity?.dominantCast}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Backscatter:</span>
                  <span className="text-emerald-400 font-medium">
                    {mockAnalysis.backscatterDensity?.level || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Analysis Confidence:</span>
                  <span className={`font-medium ${getConfidenceColor(mockAnalysis.confidence)}`}>
                    {(mockAnalysis.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Sliders" className="w-5 h-5 text-coral" />
            <span>Recommended Adjustments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(mockAnalysis.recommendedAdjustments || {}).map(([key, value]) => (
              <div key={key} className="text-center p-3 bg-slate-darker rounded-lg">
                <div className="text-xs text-gray-400 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className={`font-medium ${value > 0 ? 'text-emerald-400' : value < 0 ? 'text-coral' : 'text-gray-400'}`}>
                  {value > 0 ? '+' : ''}{value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-ocean-teal mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-white">Smart Editing Tips</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Apply these recommendations as starting points for your adjustments</li>
                <li>• Use the underwater-specific presets for faster results</li>
                <li>• Fine-tune based on your artistic vision and style preferences</li>
                <li>• Consider the viewing conditions where your image will be displayed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAnalysis;