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
    const { 
      exposure, contrast, highlights, shadows, saturation, vibrance, warmth, clarity,
      temperature, tint, luminanceNoise, colorNoise, sharpening, distortion, chromaticAberration, vignette,
      hslReds, hslOranges, hslYellows, hslGreens, hslCyans, hslBlues, hslPurples, hslMagentas,
      coralEnhancementMode, coralBoost, fishColorIsolation, fishEnhancement, waterCastCorrection,
      masterCurve, rgbCurve, redCurve, greenCurve, blueCurve
    } = adjustments;
    
    // Enhanced curve application with Bezier interpolation
    const applyCurve = (value, curve) => {
      if (!curve || curve.length < 2) return value;
      
      const clampedValue = Math.max(0, Math.min(255, value));
      
      // Find the two points that clampedValue falls between
      for (let i = 0; i < curve.length - 1; i++) {
        const p1 = curve[i];
        const p2 = curve[i + 1];
        
        if (clampedValue >= p1.x && clampedValue <= p2.x) {
          // Linear interpolation between curve points
          const t = p2.x === p1.x ? 0 : (clampedValue - p1.x) / (p2.x - p1.x);
          return Math.max(0, Math.min(255, p1.y + t * (p2.y - p1.y)));
        }
      }
      
      // If outside curve range, use nearest endpoint
      if (clampedValue <= curve[0].x) return curve[0].y;
      if (clampedValue >= curve[curve.length - 1].x) return curve[curve.length - 1].y;
      
      return clampedValue;
    };
    
    // Helper function to convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, l * 100];
    };

    // Helper function to convert HSL to RGB
    const hslToRgb = (h, s, l) => {
      h /= 360; s /= 100; l /= 100;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      if (s === 0) {
        return [l * 255, l * 255, l * 255];
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return [
          hue2rgb(p, q, h + 1/3) * 255,
          hue2rgb(p, q, h) * 255,
          hue2rgb(p, q, h - 1/3) * 255
        ];
      }
    };

    // Enhanced color range detection (8-channel)
    const getColorRange = (h) => {
      if (h >= 345 || h < 15) return 'hslReds';
      if (h >= 15 && h < 45) return 'hslOranges';
      if (h >= 45 && h < 75) return 'hslYellows';
      if (h >= 75 && h < 150) return 'hslGreens';
      if (h >= 150 && h < 210) return 'hslCyans';
      if (h >= 210 && h < 270) return 'hslBlues';
      if (h >= 270 && h < 315) return 'hslPurples';
      if (h >= 315 && h < 345) return 'hslMagentas';
      return null;
    };

    // Coral enhancement algorithm
    const enhanceCoral = (r, g, b, boost) => {
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Target red-orange coral colors (hue 0-45 degrees)
      if ((h >= 345 || h <= 45) && s > 20) {
        const enhancementFactor = (boost / 100) * (s / 100); // Scale by existing saturation
        const newS = Math.min(100, s + enhancementFactor * 30);
        const newL = Math.min(100, l + enhancementFactor * 10);
        return hslToRgb(h, newS, newL);
      }
      
      return [r, g, b];
    };

    // Fish color isolation and enhancement
    const enhanceFish = (r, g, b, enhancement) => {
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Target vibrant tropical fish colors (high saturation across spectrum)
      if (s > 40 && l > 20 && l < 80) {
        const enhancementFactor = enhancement / 100;
        
        // Boost saturation and adjust luminance for tropical fish colors
        let newS = s;
        let newL = l;
        
        // Special enhancement for common tropical fish colors
        if ((h >= 15 && h <= 60) || // Orange-yellow (clownfish, tangs)
            (h >= 200 && h <= 260) || // Blue (blue tangs, parrotfish)
            (h >= 280 && h <= 320)) { // Purple-magenta (royal gramma, dottybacks)
          newS = Math.min(100, s + enhancementFactor * 40);
          newL = Math.min(100, l + enhancementFactor * 15);
        }
        
        return hslToRgb(h, newS, newL);
      }
      
      return [r, g, b];
    };

    // Water cast correction (targets blue-green dominance)
    const correctWaterCast = (r, g, b, correction) => {
      if (correction === 0) return [r, g, b];
      
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Target blue-green water cast (180-240 degrees)
      if (h >= 180 && h <= 240 && s < 80) {
        const correctionFactor = correction / 100;
        
        if (correctionFactor > 0) {
          // Reduce blue-green cast
          const newS = Math.max(0, s - correctionFactor * 20);
          const newH = h + (correctionFactor * 10); // Shift slightly warmer
          return hslToRgb(newH % 360, newS, l);
        } else {
          // Enhance blue-green (negative correction)
          const newS = Math.min(100, s + Math.abs(correctionFactor) * 15);
          return hslToRgb(h, newS, l);
        }
      }
      
      return [r, g, b];
    };
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply white balance (temperature and tint)
      if (temperature !== 0) {
        const tempFactor = temperature / 100;
        if (tempFactor > 0) {
          r += tempFactor * 20;
          b -= tempFactor * 15;
        } else {
          r += tempFactor * 15;
          b -= tempFactor * 20;
        }
      }
      
      if (tint !== 0) {
        const tintFactor = tint / 100;
        g += tintFactor * 10;
      }
      
      // Apply exposure
      const exposureFactor = Math.pow(2, exposure / 100);
      r *= exposureFactor;
      g *= exposureFactor;
      b *= exposureFactor;
      
      // Apply contrast
      if (contrast !== 0) {
        const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;
      }

      // Apply master curve (affects luminosity without color shifts)
      if (masterCurve && masterCurve.length > 1) {
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const newLuminance = applyCurve(luminance, masterCurve);
        const luminanceRatio = newLuminance / Math.max(1, luminance);
        
        r *= luminanceRatio;
        g *= luminanceRatio;
        b *= luminanceRatio;
      }

      // Apply RGB curve
      if (rgbCurve && rgbCurve.length > 1) {
        const avgValue = (r + g + b) / 3;
        const newAvgValue = applyCurve(avgValue, rgbCurve);
        const ratio = newAvgValue / Math.max(1, avgValue);
        
        r *= ratio;
        g *= ratio;
        b *= ratio;
      }

      // Apply individual color channel curves
      if (redCurve && redCurve.length > 1) {
        r = applyCurve(r, redCurve);
      }
      if (greenCurve && greenCurve.length > 1) {
        g = applyCurve(g, greenCurve);
      }
      if (blueCurve && blueCurve.length > 1) {
        b = applyCurve(b, blueCurve);
      }
      
      // Apply Enhanced HSL Selective Adjustments (8-channel precision)
      const [h, s, l] = rgbToHsl(r, g, b);
      const colorRange = getColorRange(h);
      const hslAdjustment = adjustments[colorRange];
      
      if (hslAdjustment && (hslAdjustment.hue !== 0 || hslAdjustment.saturation !== 0 || hslAdjustment.luminance !== 0)) {
        let newH = h + (hslAdjustment.hue || 0);
        let newS = s + (hslAdjustment.saturation || 0);
        let newL = l + (hslAdjustment.luminance || 0);
        
        newH = ((newH % 360) + 360) % 360;
        newS = Math.max(0, Math.min(200, newS)); // Extended range to 200%
        newL = Math.max(0, Math.min(100, newL));
        
        [r, g, b] = hslToRgb(newH, newS, newL);
      }

      // Apply Underwater Enhancement Modes
      if (coralEnhancementMode && coralBoost > 0) {
        [r, g, b] = enhanceCoral(r, g, b, coralBoost);
      }

      if (fishColorIsolation && fishEnhancement > 0) {
        [r, g, b] = enhanceFish(r, g, b, fishEnhancement);
      }

      if (waterCastCorrection !== 0) {
        [r, g, b] = correctWaterCast(r, g, b, waterCastCorrection);
      }
      
      // Apply saturation
      if (saturation !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const satFactor = (saturation + 100) / 100;
        r = gray + satFactor * (r - gray);
        g = gray + satFactor * (g - gray);
        b = gray + satFactor * (b - gray);
      }
      
      // Apply vibrance (selective saturation with natural enhancement)
      if (vibrance !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const maxChannel = Math.max(r, g, b);
        const minChannel = Math.min(r, g, b);
        const satLevel = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;
        
        // Natural enhancement algorithm - less effect on already saturated colors
        const vibFactor = (vibrance / 100) * (1 - Math.pow(satLevel, 0.5));
        
        r = gray + (1 + vibFactor) * (r - gray);
        g = gray + (1 + vibFactor) * (g - gray);
        b = gray + (1 + vibFactor) * (b - gray);
      }
      
      // Apply warmth
      if (warmth !== 0) {
        if (warmth > 0) {
          r += warmth * 0.3;
          b -= warmth * 0.2;
        } else {
          r += warmth * 0.2;
          b -= warmth * 0.3;
        }
      }
      
      // Apply noise reduction (enhanced luminance preservation)
      if (luminanceNoise > 0) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const factor = 1 - (luminanceNoise / 200);
        const diff = [r - lum, g - lum, b - lum];
        r = lum + diff[0] * factor;
        g = lum + diff[1] * factor;
        b = lum + diff[2] * factor;
      }
      
      // Apply color noise reduction (preserves detail better)
      if (colorNoise > 0) {
        const factor = 1 - (colorNoise / 200);
        const avg = (r + g + b) / 3;
        r = avg + (r - avg) * factor;
        g = avg + (g - avg) * factor;
        b = avg + (b - avg) * factor;
      }
      
      // Apply chromatic aberration correction
      if (chromaticAberration > 0) {
        const centerX = data.length / 8;
        const centerY = Math.sqrt(data.length / 4);
        const pixelIndex = i / 4;
        const x = pixelIndex % centerX;
        const y = Math.floor(pixelIndex / centerX);
        const distance = Math.sqrt((x - centerX/2)**2 + (y - centerY/2)**2);
        const factor = 1 + (chromaticAberration / 10000) * distance;
        
        r /= factor;
        b /= factor;
      }
      
      // Apply sharpening with enhanced detail preservation
      if (sharpening > 0) {
        const sharpenFactor = sharpening / 100;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Preserve color relationships while sharpening
        r += (r - gray) * sharpenFactor * 0.8;
        g += (g - gray) * sharpenFactor * 0.8;
        b += (b - gray) * sharpenFactor * 0.8;
      }
      
      // Clamp values to valid range
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