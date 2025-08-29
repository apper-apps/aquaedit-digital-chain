import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Slider from "@/components/atoms/Slider";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ExportModal = ({ isOpen, onClose, onExport, image, className }) => {
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState(image?.dimensions?.width || 1920);
  const [height, setHeight] = useState(image?.dimensions?.height || 1080);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      format,
      quality,
      dimensions: { width, height }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={cn("w-full max-w-md", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Download" className="w-5 h-5 text-ocean-teal" />
              <span>Export Image</span>
            </CardTitle>
            <Button variant="ghost" size="small" onClick={onClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          {format !== "png" && (
            <div className="space-y-2">
              <Label>Quality: {quality}%</Label>
              <Slider
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                min={10}
                max={100}
                step={5}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Dimensions</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  placeholder="Width"
                />
              </div>
              <div className="flex items-center">
                <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  placeholder="Height"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExport} className="flex-1">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportModal;