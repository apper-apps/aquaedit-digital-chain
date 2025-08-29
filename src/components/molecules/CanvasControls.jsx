import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CanvasControls = ({ 
  zoom, 
  onZoomChange, 
  onResetZoom, 
  onToggleComparison, 
  comparisonMode,
  onToggleGrid,
  showGrid,
  className 
}) => {
  const zoomLevels = [25, 50, 75, 100, 150, 200, 300, 400];

  return (
    <div className={cn("flex items-center space-x-2 p-2 bg-slate-dark/80 backdrop-blur-sm rounded-lg", className)}>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="small"
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          disabled={zoom <= 25}
        >
          <ApperIcon name="ZoomOut" className="w-4 h-4" />
        </Button>
        
        <select
          value={zoom}
          onChange={(e) => onZoomChange(parseInt(e.target.value))}
          className="bg-slate-darker text-white text-sm px-2 py-1 rounded border border-slate-dark focus:border-ocean-teal outline-none"
        >
          {zoomLevels.map(level => (
            <option key={level} value={level}>{level}%</option>
          ))}
        </select>
        
        <Button
          variant="ghost"
          size="small"
          onClick={() => onZoomChange(Math.min(400, zoom + 25))}
          disabled={zoom >= 400}
        >
          <ApperIcon name="ZoomIn" className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="small"
          onClick={onResetZoom}
          title="Fit to screen"
        >
          <ApperIcon name="Maximize" className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-slate-dark"></div>

      <Button
        variant={comparisonMode ? "primary" : "ghost"}
        size="small"
        onClick={onToggleComparison}
        title="Toggle before/after comparison"
      >
        <ApperIcon name="GitCompare" className="w-4 h-4" />
      </Button>

      <Button
        variant={showGrid ? "primary" : "ghost"}
        size="small"
        onClick={onToggleGrid}
        title="Toggle rule of thirds grid"
      >
        <ApperIcon name="Grid3X3" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CanvasControls;