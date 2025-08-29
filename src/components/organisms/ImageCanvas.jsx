import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/atoms/Card";
import CanvasControls from "@/components/molecules/CanvasControls";
import { cn } from "@/utils/cn";

const ImageCanvas = ({ image, adjustments, className }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const applyAdjustments = useCallback((ctx, imageData, adjustments) => {
    const data = imageData.data;
    const { exposure, contrast, highlights, shadows, saturation, vibrance, warmth, clarity } = adjustments;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply exposure
      const exposureFactor = Math.pow(2, exposure / 100);
      r *= exposureFactor;
      g *= exposureFactor;
      b *= exposureFactor;
      
      // Apply contrast
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
      
      // Apply saturation
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const satFactor = (saturation + 100) / 100;
      r = gray + satFactor * (r - gray);
      g = gray + satFactor * (g - gray);
      b = gray + satFactor * (b - gray);
      
      // Apply warmth (simplified)
      if (warmth > 0) {
        r += warmth * 0.3;
        b -= warmth * 0.2;
      } else if (warmth < 0) {
        r += warmth * 0.2;
        b -= warmth * 0.3;
      }
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    return imageData;
  }, []);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !image) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      const scale = zoom / 100;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      canvas.width = Math.max(containerWidth, scaledWidth);
      canvas.height = Math.max(containerHeight, scaledHeight);
      
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const x = (canvas.width - scaledWidth) / 2 + pan.x;
      const y = (canvas.height - scaledHeight) / 2 + pan.y;
      
      if (comparisonMode) {
        // Draw original on left half
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width / 2, canvas.height);
        ctx.clip();
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        ctx.restore();
        
        // Draw adjusted on right half
        ctx.save();
        ctx.beginPath();
        ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        ctx.clip();
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Apply adjustments to right half
        const imageData = ctx.getImageData(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        const adjustedData = applyAdjustments(ctx, imageData, adjustments);
        ctx.putImageData(adjustedData, canvas.width / 2, 0);
        
        ctx.restore();
        
        // Draw divider line
        ctx.strokeStyle = "#0d9488";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Apply adjustments to entire image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const adjustedData = applyAdjustments(ctx, imageData, adjustments);
        ctx.putImageData(adjustedData, 0, 0);
      }
      
      // Draw grid overlay if enabled
      if (showGrid) {
        drawGrid(ctx, x, y, scaledWidth, scaledHeight);
      }
    };
    
    img.src = image.url;
  }, [image, zoom, pan, comparisonMode, showGrid, adjustments, applyAdjustments]);

  const drawGrid = useCallback((ctx, x, y, width, height) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Rule of thirds grid
    const thirdWidth = width / 3;
    const thirdHeight = height / 3;
    
    // Vertical lines
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x + thirdWidth * i, y);
      ctx.lineTo(x + thirdWidth * i, y + height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + thirdHeight * i);
      ctx.lineTo(x + width, y + thirdHeight * i);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -25 : 25;
    setZoom(prev => Math.max(25, Math.min(400, prev + delta)));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  if (!image) {
    return (
      <Card className={cn("flex-1 flex items-center justify-center min-h-[400px]", className)}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">No Image Selected</h3>
            <p className="text-gray-400">Upload an image to start editing</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <CanvasControls
        zoom={zoom}
        onZoomChange={setZoom}
        onResetZoom={handleResetZoom}
        onToggleComparison={() => setComparisonMode(!comparisonMode)}
        comparisonMode={comparisonMode}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showGrid={showGrid}
      />
      
      <Card className="flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="relative w-full h-[600px] overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            style={{
              cursor: isDragging ? "grabbing" : "grab"
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ImageCanvas;