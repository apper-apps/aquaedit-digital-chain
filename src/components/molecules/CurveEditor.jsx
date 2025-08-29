import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CurveEditor = ({ 
  curves, 
  onCurveChange, 
  activeChannel = 'rgb', 
  onChannelChange, 
  showHistogram = true,
  histogram = null,
  className 
}) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState(-1);
  const [hoveredPoint, setHoveredPoint] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  
  const CANVAS_WIDTH = 256;
  const CANVAS_HEIGHT = 256;
  const POINT_RADIUS = 6;
  
  // Underwater curve presets
  const underwaterPresets = [
    {
      name: "Underwater Clarity",
      description: "Enhances visibility in murky water",
      curves: {
        rgb: [{ x: 0, y: 15 }, { x: 64, y: 80 }, { x: 128, y: 140 }, { x: 192, y: 210 }, { x: 255, y: 255 }],
        red: [{ x: 0, y: 0 }, { x: 128, y: 140 }, { x: 255, y: 255 }],
        green: [{ x: 0, y: 0 }, { x: 128, y: 125 }, { x: 255, y: 255 }],
        blue: [{ x: 0, y: 0 }, { x: 128, y: 115 }, { x: 255, y: 255 }]
      }
    },
    {
      name: "Deep Water Contrast",
      description: "Boosts contrast for deep water shots",
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 32, y: 20 }, { x: 96, y: 110 }, { x: 160, y: 180 }, { x: 224, y: 235 }, { x: 255, y: 255 }],
        red: [{ x: 0, y: 0 }, { x: 128, y: 135 }, { x: 255, y: 255 }],
        green: [{ x: 0, y: 0 }, { x: 128, y: 130 }, { x: 255, y: 255 }],
        blue: [{ x: 0, y: 0 }, { x: 128, y: 120 }, { x: 255, y: 255 }]
      }
    },
    {
      name: "Coral Pop",
      description: "Enhances coral reds and oranges",
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 128, y: 135 }, { x: 255, y: 255 }],
        red: [{ x: 0, y: 0 }, { x: 96, y: 120 }, { x: 160, y: 180 }, { x: 255, y: 255 }],
        green: [{ x: 0, y: 0 }, { x: 128, y: 125 }, { x: 255, y: 255 }],
        blue: [{ x: 0, y: 0 }, { x: 128, y: 110 }, { x: 255, y: 255 }]
      }
    },
    {
      name: "Cave Drama",
      description: "High contrast for cave photography",
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 48, y: 30 }, { x: 80, y: 90 }, { x: 176, y: 200 }, { x: 208, y: 240 }, { x: 255, y: 255 }],
        red: [{ x: 0, y: 0 }, { x: 128, y: 140 }, { x: 255, y: 255 }],
        green: [{ x: 0, y: 0 }, { x: 128, y: 135 }, { x: 255, y: 255 }],
        blue: [{ x: 0, y: 0 }, { x: 128, y: 125 }, { x: 255, y: 255 }]
      }
    }
  ];

  // Channel colors
  const channelColors = {
    rgb: '#ffffff',
    red: '#ef4444',
    green: '#22c55e',
    blue: '#3b82f6'
  };

  const getCurrentCurve = useCallback(() => {
    return curves[activeChannel] || [{ x: 0, y: 0 }, { x: 255, y: 255 }];
  }, [curves, activeChannel]);

  // Convert canvas coordinates to curve values
  const canvasToValue = useCallback((canvasX, canvasY) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const x = Math.max(0, Math.min(255, (canvasX / rect.width) * 255));
    const y = Math.max(0, Math.min(255, 255 - ((canvasY / rect.height) * 255)));
    
    return { x: Math.round(x), y: Math.round(y) };
  }, []);

  // Convert curve values to canvas coordinates
  const valueToCanvas = useCallback((x, y) => {
    return {
      x: (x / 255) * CANVAS_WIDTH,
      y: CANVAS_HEIGHT - (y / 255) * CANVAS_HEIGHT
    };
  }, []);

  // Find nearest point on curve
  const findNearestPoint = useCallback((canvasX, canvasY) => {
    const curve = getCurrentCurve();
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    curve.forEach((point, index) => {
      const canvas = valueToCanvas(point.x, point.y);
      const distance = Math.sqrt(
        Math.pow(canvasX - canvas.x, 2) + Math.pow(canvasY - canvas.y, 2)
      );

      if (distance < nearestDistance && distance < POINT_RADIUS * 2) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }, [getCurrentCurve, valueToCanvas]);

  // Bezier curve interpolation
  const interpolateCurve = useCallback((points) => {
    if (points.length < 2) return points;

    const result = [];
    for (let x = 0; x <= 255; x++) {
      let y = x; // Default linear

      // Find the two points that x falls between
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        if (x >= p1.x && x <= p2.x) {
          // Linear interpolation between points
          const t = (x - p1.x) / (p2.x - p1.x);
          y = p1.y + t * (p2.y - p1.y);
          break;
        }
      }

      result.push({ x, y: Math.round(y) });
    }
    return result;
  }, []);

  // Auto curve based on histogram analysis
  const applyAutoCurve = useCallback(() => {
    if (!histogram) {
      // Generate basic auto curve without histogram
      const autoCurve = [
        { x: 0, y: 10 },
        { x: 64, y: 75 },
        { x: 128, y: 135 },
        { x: 192, y: 200 },
        { x: 255, y: 250 }
      ];
      
      onCurveChange(activeChannel, autoCurve);
      return;
    }

    // Analyze histogram for auto curve generation
    let shadowClip = 0;
    let highlightClip = 255;
    
    const total = histogram.reduce((sum, val) => sum + val, 0);
    let cumulative = 0;
    
    // Find shadow clipping point (1% of pixels)
    for (let i = 0; i < histogram.length; i++) {
      cumulative += histogram[i];
      if (cumulative / total > 0.01) {
        shadowClip = i;
        break;
      }
    }
    
    // Find highlight clipping point (99% of pixels)
    cumulative = 0;
    for (let i = histogram.length - 1; i >= 0; i--) {
      cumulative += histogram[i];
      if (cumulative / total > 0.01) {
        highlightClip = i;
        break;
      }
    }

    const autoCurve = [
      { x: 0, y: 0 },
      { x: shadowClip, y: 0 },
      { x: 128, y: 128 + 15 }, // Slight contrast boost
      { x: highlightClip, y: 255 },
      { x: 255, y: 255 }
    ];

    onCurveChange(activeChannel, autoCurve);
  }, [histogram, activeChannel, onCurveChange]);

  // Apply preset curves
  const applyPreset = useCallback((preset) => {
    Object.entries(preset.curves).forEach(([channel, curve]) => {
      onCurveChange(channel, curve);
    });
  }, [onCurveChange]);

  // Drawing function
  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= CANVAS_WIDTH; x += CANVAS_WIDTH / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= CANVAS_HEIGHT; y += CANVAS_HEIGHT / 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    }

    // Draw histogram background
    if (showHistogram && histogram) {
      const maxValue = Math.max(...histogram);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      
      for (let i = 0; i < histogram.length; i++) {
        const height = (histogram[i] / maxValue) * CANVAS_HEIGHT * 0.3;
        const x = (i / 255) * CANVAS_WIDTH;
        ctx.fillRect(x, CANVAS_HEIGHT - height, 2, height);
      }
    }

    // Draw diagonal reference line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, 0);
    ctx.stroke();

    // Draw interpolated curve
    const curve = getCurrentCurve();
    const interpolated = interpolateCurve(curve);
    
    ctx.strokeStyle = channelColors[activeChannel];
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    interpolated.forEach((point, index) => {
      const canvas = valueToCanvas(point.x, point.y);
      if (index === 0) {
        ctx.moveTo(canvas.x, canvas.y);
      } else {
        ctx.lineTo(canvas.x, canvas.y);
      }
    });
    ctx.stroke();

    // Draw control points
    curve.forEach((point, index) => {
      const canvas = valueToCanvas(point.x, point.y);
      
      ctx.fillStyle = channelColors[activeChannel];
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      if (index === hoveredPoint || index === dragPointIndex) {
        ctx.beginPath();
        ctx.arc(canvas.x, canvas.y, POINT_RADIUS + 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(canvas.x, canvas.y, POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    });
  }, [getCurrentCurve, interpolateCurve, valueToCanvas, channelColors, activeChannel, showGrid, showHistogram, histogram, hoveredPoint, dragPointIndex]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    const pointIndex = findNearestPoint(canvasX, canvasY);
    
    if (pointIndex !== -1) {
      setIsDragging(true);
      setDragPointIndex(pointIndex);
    } else {
      // Add new point
      const newPoint = canvasToValue(canvasX, canvasY);
      const curve = [...getCurrentCurve()];
      
      // Find insertion index to maintain x-order
      let insertIndex = curve.length;
      for (let i = 0; i < curve.length; i++) {
        if (newPoint.x < curve[i].x) {
          insertIndex = i;
          break;
        }
      }
      
      curve.splice(insertIndex, 0, newPoint);
      onCurveChange(activeChannel, curve);
    }
  }, [findNearestPoint, canvasToValue, getCurrentCurve, activeChannel, onCurveChange]);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    if (isDragging && dragPointIndex !== -1) {
      const newPoint = canvasToValue(canvasX, canvasY);
      const curve = [...getCurrentCurve()];
      
      // Don't allow moving first or last point horizontally
      if (dragPointIndex === 0) {
        newPoint.x = 0;
      } else if (dragPointIndex === curve.length - 1) {
        newPoint.x = 255;
      }
      
      curve[dragPointIndex] = newPoint;
      
      // Sort curve by x values to maintain order
      curve.sort((a, b) => a.x - b.x);
      
      onCurveChange(activeChannel, curve);
    } else {
      // Update hover state
      const pointIndex = findNearestPoint(canvasX, canvasY);
      setHoveredPoint(pointIndex);
    }
  }, [isDragging, dragPointIndex, canvasToValue, getCurrentCurve, activeChannel, onCurveChange, findNearestPoint]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPointIndex(-1);
  }, []);

  const handleDoubleClick = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const pointIndex = findNearestPoint(canvasX, canvasY);
    
    if (pointIndex !== -1 && pointIndex !== 0 && pointIndex !== getCurrentCurve().length - 1) {
      // Remove point (except first and last)
      const curve = [...getCurrentCurve()];
      curve.splice(pointIndex, 1);
      onCurveChange(activeChannel, curve);
    }
  }, [findNearestPoint, getCurrentCurve, activeChannel, onCurveChange]);

  // Reset current channel curve
  const resetCurve = useCallback(() => {
    onCurveChange(activeChannel, [{ x: 0, y: 0 }, { x: 255, y: 255 }]);
  }, [activeChannel, onCurveChange]);

  useEffect(() => {
    drawCurve();
  }, [drawCurve]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        {/* Curve Canvas */}
        <div className="mb-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-64 bg-slate-darker rounded border border-ocean-teal/30 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Channel Selector */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {Object.entries(channelColors).map(([channel, color]) => (
            <Button
              key={channel}
              variant={activeChannel === channel ? "secondary" : "ghost"}
              size="small"
              className="text-xs"
              style={{ 
                color: activeChannel === channel ? '#ffffff' : color,
                borderColor: activeChannel === channel ? color : 'transparent'
              }}
              onClick={() => onChannelChange(channel)}
            >
              {channel.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button 
            variant="secondary" 
            size="small" 
            className="text-xs"
            onClick={applyAutoCurve}
          >
            <ApperIcon name="Activity" className="w-3 h-3 mr-1" />
            Auto Curve
          </Button>
          <Button 
            variant="secondary" 
            size="small" 
            className="text-xs"
            onClick={resetCurve}
          >
            <ApperIcon name="RotateCcw" className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="small"
            className="text-xs"
            onClick={() => setShowGrid(!showGrid)}
          >
            <ApperIcon name="Grid3X3" className="w-3 h-3 mr-1" />
            {showGrid ? 'Hide' : 'Show'} Grid
          </Button>
          <span className="text-xs text-gray-400">
            Click: Add • Drag: Move • Double-click: Remove
          </span>
        </div>

        {/* Underwater Presets */}
        <div>
          <h5 className="text-xs font-medium text-gray-300 mb-2">Underwater Presets</h5>
          <div className="grid grid-cols-2 gap-2">
            {underwaterPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="ghost"
                size="small"
                className="text-xs p-2 h-auto flex-col items-start"
                onClick={() => applyPreset(preset)}
              >
                <span className="font-medium">{preset.name}</span>
                <span className="text-gray-400 text-[10px]">{preset.description}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurveEditor;