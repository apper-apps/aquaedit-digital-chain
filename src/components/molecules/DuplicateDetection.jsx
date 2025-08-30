import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ImageQualityCheck = ({ image }) => {
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
            Upload an image to analyze its quality and characteristics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getQualityScore = () => {
    const { width = 0, height = 0 } = image.dimensions || {};
    const megapixels = (width * height) / 1000000;
    
    if (megapixels >= 20) return { score: "Excellent", color: "text-emerald-400", icon: "CheckCircle" };
    if (megapixels >= 10) return { score: "Very Good", color: "text-ocean-teal", icon: "CheckCircle" };
    if (megapixels >= 5) return { score: "Good", color: "text-amber-400", icon: "AlertCircle" };
    return { score: "Basic", color: "text-red-400", icon: "AlertTriangle" };
  };

  const quality = getQualityScore();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-slate-dark rounded-lg flex items-center justify-center">
              <ApperIcon name="Image" className="w-8 h-8 text-ocean-teal" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{image.filename}</h3>
              <p className="text-gray-400">{formatFileSize(image.metadata?.size || 0)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Image Properties</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dimensions:</span>
                  <span className="text-white">
                    {image.dimensions?.width || 0} × {image.dimensions?.height || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Megapixels:</span>
                  <span className="text-white">
                    {((image.dimensions?.width || 0) * (image.dimensions?.height || 0) / 1000000).toFixed(1)}MP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="text-white">{image.format || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aspect Ratio:</span>
                  <span className="text-white">
                    {image.metadata?.aspectRatio ? image.metadata.aspectRatio.toFixed(2) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-white">Quality Assessment</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Overall Quality:</span>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={quality.icon} className={`w-4 h-4 ${quality.color}`} />
                    <span className={`font-medium ${quality.color}`}>{quality.score}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-darker rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Zap" className="w-4 h-4 text-ocean-teal" />
                    <span className="text-sm font-medium text-white">Editing Recommendations</span>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Image is ready for professional editing</li>
                    <li>• All adjustment tools are available</li>
                    <li>• RAW format provides maximum flexibility</li>
                    <li>• Export options support high quality output</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="Info" className="w-5 h-5 text-ocean-teal" />
            <h4 className="font-medium text-white">Single Image Workflow Benefits</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Zap" className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Optimal browser performance</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Eye" className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Real-time preview updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Smartphone" className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Mobile device compatibility</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Cpu" className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Efficient memory usage</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Layers" className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Full professional toolset</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Download" className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Fast export processing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageQualityCheck;