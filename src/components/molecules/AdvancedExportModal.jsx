import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Label from "@/components/atoms/Label";
import Slider from "@/components/atoms/Slider";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
const AdvancedExportModal = ({ isOpen, onClose, onExport, image, className }) => {
  // Export Settings State
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);
  const [compression, setCompression] = useState(6);
const [width, setWidth] = useState(image?.dimensions?.width || 1920);
  const [height, setHeight] = useState(image?.dimensions?.height || 1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [colorSpace, setColorSpace] = useState("sRGB");
  const [bitDepth, setBitDepth] = useState(8);
  const [colorProfile, setColorProfile] = useState("sRGB");
  // Batch Export State
  const [batchMode, setBatchMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  
  // Watermark State
  const [enableWatermark, setEnableWatermark] = useState(false);
  const [watermarkType, setWatermarkType] = useState("text");
  const [watermarkText, setWatermarkText] = useState("© AquaEdit Pro");
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [watermarkSize, setWatermarkSize] = useState(12);
  
// Metadata State
  const [preserveExif, setPreserveExif] = useState(true);
  const [removeGPS, setRemoveGPS] = useState(false);
  const [customMetadata, setCustomMetadata] = useState({
    diveSite: "",
    depth: "",
    waterTemp: "",
    visibility: "",
    marineLife: "",
    scientificName: "",
    conservationStatus: "",
    behaviorObserved: "",
    diveNumber: "",
    buddy: "",
    diveMaster: "",
    certification: "",
    equipment: {
      housing: "",
      strobes: "",
      filters: ""
    },
    research: {
      studyId: "",
      institution: "",
      specimenId: ""
    },
    copyright: "",
    photographer: "",
    license: "",
    keywords: ""
  });
  
  // UI State
  const [activeTab, setActiveTab] = useState("format");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [estimatedFileSize, setEstimatedFileSize] = useState("~2.5 MB");

// Export Presets
  const exportPresetOptions = [
    {
      id: "instagram",
      name: "Instagram Ready",
      description: "Perfect square format for social media",
      format: "jpeg",
      quality: 95,
      width: 1080,
      height: 1080,
      colorSpace: "sRGB",
      icon: "Instagram"
    },
    {
      id: "facebook-cover",
      name: "Facebook Cover",
      description: "Optimized for Facebook cover photos",
      format: "jpeg",
      quality: 90,
      width: 1200,
      height: 630,
      colorSpace: "sRGB",
      icon: "Facebook"
    },
    {
id: "print-portfolio",
      name: "Print Portfolio",
      description: "High-resolution TIFF for professional printing",
      format: "tiff",
      width: image?.dimensions?.width || 4000,
      height: image?.dimensions?.height || 3000,
      colorSpace: "Adobe RGB",
      bitDepth: 16,
      profile: "Adobe RGB (1998)",
      icon: "Printer"
    },
    {
      id: "web-gallery",
      name: "Web Gallery",
      description: "Optimized for web galleries and portfolios",
      format: "jpeg",
      quality: 85,
      width: 1920,
      height: 1280,
      colorSpace: "sRGB",
      icon: "Monitor"
    },
    {
      id: "email-sharing",
      name: "Email Sharing",
      description: "Compressed for email attachments",
      format: "jpeg",
      quality: 75,
      width: 800,
      height: 600,
      colorSpace: "sRGB",
      icon: "Mail"
    },
    {
      id: "original",
      name: "Original Format",
      description: "Preserve original file format and quality",
      format: image?.format?.split('/')[1] || "jpeg",
      quality: 100,
      width: image?.dimensions?.width || 1920,
      height: image?.dimensions?.height || 1080,
      colorSpace: "Original",
      icon: "FileImage"
    }
  ];

  // File size estimation
  useEffect(() => {
    const estimateFileSize = () => {
      if (!width || !height) return;
      
      const pixels = width * height;
      let bytesPerPixel;
      
      switch (format) {
        case "tiff":
          bytesPerPixel = 6; // Uncompressed RGB
          break;
        case "png":
          bytesPerPixel = 4 * (compression / 9); // RGBA with compression
          break;
        case "webp":
          bytesPerPixel = (quality / 100) * 3;
          break;
        default: // jpeg
          bytesPerPixel = (quality / 100) * 3;
      }
      
      const estimatedBytes = pixels * bytesPerPixel;
      const mb = estimatedBytes / (1024 * 1024);
      setEstimatedFileSize(mb < 1 ? `${(mb * 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`);
    };
    
    estimateFileSize();
  }, [format, quality, compression, width, height]);

  // Apply preset
  const applyPreset = (preset) => {
    setFormat(preset.format);
    setQuality(preset.quality);
    setWidth(preset.width);
    setHeight(preset.height);
    setColorSpace(preset.colorSpace);
    setSelectedPreset(preset.id);
    toast.success(`Applied ${preset.name} preset`);
  };

  // Handle dimension changes with aspect ratio
  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    if (maintainAspectRatio && image?.dimensions) {
      const aspectRatio = image.dimensions.height / image.dimensions.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    if (maintainAspectRatio && image?.dimensions) {
      const aspectRatio = image.dimensions.width / image.dimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // Export handler with progress simulation
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const exportSettings = {
        format,
        quality,
        compression,
        dimensions: { width, height },
        colorSpace,
        watermark: enableWatermark ? {
          type: watermarkType,
          text: watermarkText,
          position: watermarkPosition,
          opacity: watermarkOpacity,
          size: watermarkSize
        } : null,
        metadata: {
          preserveExif,
          removeGPS,
          custom: customMetadata
        },
        batchMode,
        selectedImages: batchMode ? selectedImages : [image]
      };
      
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      onExport(exportSettings);
      toast.success(`Successfully exported ${batchMode ? selectedImages.length + ' images' : 'image'} as ${format.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error("Export failed. Please try again.");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Tab definitions
  const tabs = [
    { id: "format", label: "Format & Quality", icon: "FileImage" },
    { id: "size", label: "Dimensions", icon: "Maximize2" },
    { id: "watermark", label: "Watermark", icon: "Type" },
    { id: "metadata", label: "Metadata", icon: "Info" },
    { id: "batch", label: "Batch Export", icon: "Layers" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={cn("w-full max-w-4xl max-h-[90vh] overflow-hidden", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Download" className="w-5 h-5 text-ocean-teal" />
              <span>Advanced Export</span>
              {selectedPreset && (
<span className="text-sm text-ocean-teal bg-ocean-teal/20 px-2 py-1 rounded">
                  {exportPresetOptions.find(p => p.id === selectedPreset)?.name}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-400">
                Estimated: {estimatedFileSize}
              </div>
              <Button variant="ghost" size="small" onClick={onClose}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Export Progress */}
          {isExporting && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-ocean-teal">Exporting...</span>
                <span>{exportProgress}%</span>
              </div>
              <div className="w-full bg-slate-darker rounded-full h-2">
                <div 
                  className="bg-ocean-teal h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Presets */}
          <div>
            <Label className="text-base font-medium mb-3 block">Export Presets</Label>
<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {exportPresetOptions.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    selectedPreset === preset.id
                      ? "border-ocean-teal bg-ocean-teal/10"
                      : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                  )}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <ApperIcon name={preset.icon} className="w-4 h-4 text-ocean-teal" />
                    <span className="font-medium text-white text-sm">{preset.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">{preset.description}</p>
                  <div className="text-xs text-ocean-teal mt-1">
                    {preset.format.toUpperCase()} • {preset.width}×{preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-darker rounded-lg p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                  activeTab === tab.id
                    ? "bg-ocean-teal text-white"
                    : "text-gray-400 hover:text-gray-300"
                )}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "format" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                      >
                        <option value="jpeg">JPEG - Standard web format</option>
                        <option value="png">PNG - Lossless with transparency</option>
<option value="webp">WebP - Modern web format</option>
                        <option value="tiff">TIFF - Professional print quality</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Color Space & Profile</Label>
                        <select
                        value={colorSpace}
                        onChange={(e) => {
                          setColorSpace(e.target.value);
                          setColorProfile(e.target.value === 'sRGB' ? 'sRGB IEC61966-2.1' : 
                                          e.target.value === 'Adobe RGB' ? 'Adobe RGB (1998)' : 
                                          'ProPhoto RGB');
                        }}
                        className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                      >
                        <option value="sRGB">sRGB - Web standard (8-bit)</option>
                        <option value="Adobe RGB">Adobe RGB - Professional print (16-bit)</option>
                        <option value="ProPhoto RGB">ProPhoto RGB - Maximum gamut (16-bit)</option>
                      </select>
                      
                      <Label className="mt-3">Bit Depth</Label>
                      <select
                        value={bitDepth}
                        onChange={(e) => setBitDepth(parseInt(e.target.value))}
                        className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                      >
                        <option value={8}>8-bit (256 levels per channel)</option>
                        <option value={16}>16-bit (65,536 levels per channel)</option>
                      </select>
                      
                      <div className="mt-3 p-3 bg-slate-darker rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ApperIcon name="Info" className="w-4 h-4 text-ocean-teal" />
                          <span className="text-sm font-medium">Color Profile Info</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Active Profile: {colorProfile}<br/>
                          Gamut: {colorSpace === 'sRGB' ? '~35% of visible colors' : 
                                  colorSpace === 'Adobe RGB' ? '~50% of visible colors' : 
                                  '~90% of visible colors'}<br/>
                          Recommended for: {colorSpace === 'sRGB' ? 'Web display' : 
                                           colorSpace === 'Adobe RGB' ? 'Professional printing' : 
                                           'High-end photo editing'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {format !== "tiff" && (
                      <div className="space-y-2">
                        <Label>
                          {format === "png" ? "Compression Level" : "Quality"}: {format === "png" ? compression : quality}{format === "png" ? "/9" : "%"}
                        </Label>
                        <Slider
                          value={format === "png" ? compression : quality}
                          onChange={(e) => format === "png" ? setCompression(parseInt(e.target.value)) : setQuality(parseInt(e.target.value))}
                          min={format === "png" ? 0 : 10}
                          max={format === "png" ? 9 : 100}
                          step={1}
                        />
                        <div className="text-xs text-gray-400">
                          {format === "png" ? "0 = No compression, 9 = Maximum compression" : "Higher values = Better quality, larger file size"}
                        </div>
                      </div>
                    )}

                    {format === "tiff" && (
                      <div className="p-4 bg-ocean-teal/10 rounded-lg border border-ocean-teal/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <ApperIcon name="Award" className="w-4 h-4 text-ocean-teal" />
                          <span className="font-medium text-ocean-teal">Professional Quality</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          TIFF format provides uncompressed, print-ready output with full color depth preservation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-dark">
                  <Label className="text-base font-medium mb-3 block">Format Comparison</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="font-medium text-white">JPEG</div>
                      <div className="text-gray-400">Best for photos, smaller files</div>
                      <div className="text-green-400">✓ Universal support</div>
                      <div className="text-red-400">✗ Lossy compression</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-white">PNG</div>
                      <div className="text-gray-400">Lossless with transparency</div>
                      <div className="text-green-400">✓ Transparency support</div>
                      <div className="text-red-400">✗ Larger file sizes</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-white">WebP</div>
                      <div className="text-gray-400">Modern web optimized</div>
                      <div className="text-green-400">✓ Best compression</div>
                      <div className="text-red-400">✗ Limited support</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-white">TIFF</div>
                      <div className="text-gray-400">Professional archival</div>
                      <div className="text-green-400">✓ No quality loss</div>
                      <div className="text-red-400">✗ Very large files</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "size" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Custom Dimensions</Label>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label className="text-sm">Width (px)</Label>
                          <Input
                            type="number"
                            value={width}
                            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                            placeholder="Width"
                          />
                        </div>
                        <div className="flex items-end pb-2">
                          <button
                            onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                            className={cn(
                              "p-2 rounded border transition-colors",
                              maintainAspectRatio 
                                ? "border-ocean-teal text-ocean-teal bg-ocean-teal/10"
                                : "border-slate-dark text-gray-400"
                            )}
                            title="Lock aspect ratio"
                          >
                            <ApperIcon name={maintainAspectRatio ? "Lock" : "Unlock"} className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm">Height (px)</Label>
                          <Input
                            type="number"
                            value={height}
                            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                            placeholder="Height"
                          />
                        </div>
                      </div>
                      
                      {image?.dimensions && (
                        <div className="text-xs text-gray-400">
                          Original: {image.dimensions.width} × {image.dimensions.height} px
                          {maintainAspectRatio && (
                            <span className="ml-2 text-ocean-teal">• Aspect ratio locked</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Quick Sizes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setWidth(image?.dimensions?.width || 1920);
                          setHeight(image?.dimensions?.height || 1080);
                        }}
                      >
                        Original Size
                      </Button>
                      <Button variant="secondary" size="small" onClick={() => { setWidth(1920); setHeight(1080); }}>
                        Web (1920×1080)
                      </Button>
                      <Button variant="secondary" size="small" onClick={() => { setWidth(1080); setHeight(1080); }}>
                        Social (1080×1080)
                      </Button>
                      <Button variant="secondary" size="small" onClick={() => { setWidth(3000); setHeight(2000); }}>
                        Print (300 DPI)
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-dark">
                  <Label className="text-base font-medium mb-3 block">Size Recommendations</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="font-medium text-white">Social Media</div>
                      <div className="space-y-1 text-gray-400">
                        <div>Instagram Post: 1080×1080</div>
                        <div>Instagram Story: 1080×1920</div>
                        <div>Facebook Cover: 1200×630</div>
                        <div>Twitter Header: 1500×500</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="font-medium text-white">Print & Web</div>
                      <div className="space-y-1 text-gray-400">
                        <div>4×6 Print: 1800×1200</div>
                        <div>8×10 Print: 3000×2400</div>
                        <div>Web Gallery: 1920×1280</div>
                        <div>Email Share: 800×600</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "watermark" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="enableWatermark"
                    checked={enableWatermark}
                    onChange={(e) => setEnableWatermark(e.target.checked)}
                    className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                  />
                  <Label htmlFor="enableWatermark" className="text-base font-medium">Enable Watermark</Label>
</div>

                {enableWatermark && (
                  <>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Watermark Type</Label>
                            <select
                              value={watermarkType}
                              onChange={(e) => setWatermarkType(e.target.value)}
                              className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                            >
                              <option value="text">Text Watermark</option>
                              <option value="logo">Logo/Image</option>
                            </select>
                          </div>

                          {watermarkType === "text" && (
                            <div className="space-y-2">
                              <Label>Watermark Text</Label>
                              <Input
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder="© Your Name"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Font Size: {watermarkSize}px</Label>
                            <Slider
                              value={watermarkSize}
                              onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                              min={8}
                              max={72}
                              step={1}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Opacity: {watermarkOpacity}%</Label>
                            <Slider
                              value={watermarkOpacity}
                              onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                              min={10}
                              max={100}
                              step={5}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>Position</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { pos: "top-left", label: "↖" },
                              { pos: "top-center", label: "↑" },
                              { pos: "top-right", label: "↗" },
                              { pos: "center-left", label: "←" },
                              { pos: "center", label: "●" },
                              { pos: "center-right", label: "→" },
                              { pos: "bottom-left", label: "↙" },
                              { pos: "bottom-center", label: "↓" },
                              { pos: "bottom-right", label: "↘" }
                            ].map(({ pos, label }) => (
                              <button
                                key={pos}
                                onClick={() => setWatermarkPosition(pos)}
                                className={cn(
                                  "p-3 rounded-lg border text-center transition-colors",
                                  watermarkPosition === pos
                                    ? "border-ocean-teal bg-ocean-teal/20 text-ocean-teal"
                                    : "border-slate-dark bg-slate-darker text-gray-400 hover:text-gray-300"
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {watermarkType === "logo" && (
                        <div className="pt-4 border-t border-slate-dark">
                          <Label className="text-base font-medium mb-3 block">Logo Upload</Label>
                          <div className="border-2 border-dashed border-slate-dark rounded-lg p-6 text-center hover:border-ocean-teal/50 transition-colors cursor-pointer">
                            <ApperIcon name="Upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400">Click to upload logo or drag & drop</p>
                            <p className="text-xs text-gray-500 mt-1">PNG or SVG recommended for transparency</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-dark">
                        <Label className="text-base font-medium mb-3 block">Preview</Label>
                        <div className="bg-slate-darker rounded-lg p-4 text-center relative min-h-[120px] flex items-center justify-center border border-slate-dark">
                          <div className="text-gray-500">Image Preview</div>
                          <div
                            className={cn(
                              "absolute text-white text-xs px-2 py-1 bg-black/50 rounded",
                              watermarkPosition.includes("top") && "top-2",
                              watermarkPosition.includes("center") && !watermarkPosition.includes("top") && !watermarkPosition.includes("bottom") && "top-1/2 -translate-y-1/2",
                              watermarkPosition.includes("bottom") && "bottom-2",
                              watermarkPosition.includes("left") && "left-2",
                              watermarkPosition.includes("center") && !watermarkPosition.includes("left") && !watermarkPosition.includes("right") && "left-1/2 -translate-x-1/2",
                              watermarkPosition.includes("right") && "right-2"
                            )}
                            style={{ 
                              opacity: watermarkOpacity / 100,
                              fontSize: `${watermarkSize / 4}px`
                            }}
                          >
                            {watermarkText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
)}

            {activeTab === "metadata" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">EXIF & Technical Data</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="preserveExif"
                          checked={preserveExif}
                          onChange={(e) => setPreserveExif(e.target.checked)}
                          className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                        />
                        <Label htmlFor="preserveExif">Preserve original EXIF data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="removeGPS"
                          checked={removeGPS}
                          onChange={(e) => setRemoveGPS(e.target.checked)}
                          className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                        />
                        <Label htmlFor="removeGPS">Remove GPS coordinates (privacy)</Label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-dark">
                      <Label className="text-base font-medium mb-3 block">Copyright & Attribution</Label>
                      <div className="space-y-3">
                        <Input
                          placeholder="Photographer name"
                          value={customMetadata.photographer}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, photographer: e.target.value }))}
                        />
                        <Input
                          placeholder="Copyright notice"
                          value={customMetadata.copyright}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, copyright: e.target.value }))}
                        />
                        <select
                          value={customMetadata.license}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, license: e.target.value }))}
                          className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                        >
                          <option value="">Select License</option>
                          <option value="All Rights Reserved">All Rights Reserved</option>
                          <option value="CC BY 4.0">Creative Commons BY 4.0</option>
                          <option value="CC BY-SA 4.0">Creative Commons BY-SA 4.0</option>
                          <option value="CC BY-NC 4.0">Creative Commons BY-NC 4.0</option>
                          <option value="Royalty Free">Royalty Free</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Underwater Photography Metadata</Label>
                    <div className="space-y-3">
                      <Input
                        placeholder="Dive site location"
                        value={customMetadata.diveSite}
                        onChange={(e) => setCustomMetadata(prev => ({ ...prev, diveSite: e.target.value }))}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Depth (m/ft)"
                          value={customMetadata.depth}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, depth: e.target.value }))}
                        />
                        <Input
                          placeholder="Water temp (°C/°F)"
                          value={customMetadata.waterTemp}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, waterTemp: e.target.value }))}
                        />
                        <Input
                          placeholder="Visibility (m/ft)"
                          value={customMetadata.visibility}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, visibility: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-slate-dark">
                        <Label className="text-sm font-medium">Marine Life Identification</Label>
                        <Input
                          placeholder="Primary subject (common name)"
                          value={customMetadata.marineLife}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, marineLife: e.target.value }))}
                        />
                        <Input
                          placeholder="Scientific name"
                          value={customMetadata.scientificName}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, scientificName: e.target.value }))}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={customMetadata.conservationStatus}
                            onChange={(e) => setCustomMetadata(prev => ({ ...prev, conservationStatus: e.target.value }))}
                            className="w-full bg-slate-darker text-white px-3 py-2 rounded-lg border border-slate-dark focus:border-ocean-teal outline-none"
                          >
                            <option value="">Conservation Status</option>
                            <option value="LC">Least Concern (LC)</option>
                            <option value="NT">Near Threatened (NT)</option>
                            <option value="VU">Vulnerable (VU)</option>
                            <option value="EN">Endangered (EN)</option>
                            <option value="CR">Critically Endangered (CR)</option>
                            <option value="EW">Extinct in Wild (EW)</option>
                            <option value="EX">Extinct (EX)</option>
                            <option value="DD">Data Deficient (DD)</option>
                          </select>
                          <Input
                            placeholder="Behavior observed"
                            value={customMetadata.behaviorObserved}
                            onChange={(e) => setCustomMetadata(prev => ({ ...prev, behaviorObserved: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Dive number"
                          value={customMetadata.diveNumber}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, diveNumber: e.target.value }))}
                        />
                        <Input
                          placeholder="Dive buddy"
                          value={customMetadata.buddy}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, buddy: e.target.value }))}
                        />
                        <Input
                          placeholder="Dive master"
                          value={customMetadata.diveMaster}
                          onChange={(e) => setCustomMetadata(prev => ({ ...prev, diveMaster: e.target.value }))}
                        />
                      </div>
                      <Input
                        placeholder="Certification level"
                        value={customMetadata.certification}
                        onChange={(e) => setCustomMetadata(prev => ({ ...prev, certification: e.target.value }))}
                      />
                      
                      <div className="space-y-3 pt-3 border-t border-slate-dark">
                        <Label className="text-sm font-medium">Equipment Tracking</Label>
                        <Input
                          placeholder="Housing make/model"
                          value={customMetadata.equipment.housing}
                          onChange={(e) => setCustomMetadata(prev => ({ 
                            ...prev, 
                            equipment: { ...prev.equipment, housing: e.target.value }
                          }))}
                        />
                        <Input
                          placeholder="Strobe configuration"
                          value={customMetadata.equipment.strobes}
                          onChange={(e) => setCustomMetadata(prev => ({ 
                            ...prev, 
                            equipment: { ...prev.equipment, strobes: e.target.value }
                          }))}
                        />
                        <Input
                          placeholder="Filters used"
                          value={customMetadata.equipment.filters}
                          onChange={(e) => setCustomMetadata(prev => ({ 
                            ...prev, 
                            equipment: { ...prev.equipment, filters: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-slate-dark">
                        <Label className="text-sm font-medium">Research Integration</Label>
                        <Input
                          placeholder="Study ID"
                          value={customMetadata.research.studyId}
                          onChange={(e) => setCustomMetadata(prev => ({ 
                            ...prev, 
                            research: { ...prev.research, studyId: e.target.value }
                          }))}
                        />
                        <Input
                          placeholder="Research institution"
                          value={customMetadata.research.institution}
                          onChange={(e) => setCustomMetadata(prev => ({ 
                            ...prev, 
                            research: { ...prev.research, institution: e.target.value }
                          }))}
                        />
                        <Input
                          placeholder="Specimen ID"
                          value={customMetadata.research.specimenId}
                          onChange={(e) => setCustomMetadata(prev => ({ 
                            ...prev, 
                            research: { ...prev.research, specimenId: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-dark">
                  <Label className="text-base font-medium mb-3 block">Keywords & Tags</Label>
                  <Input
                    placeholder="Separate keywords with commas (e.g., underwater, coral reef, scuba diving)"
                    value={customMetadata.keywords}
                    onChange={(e) => setCustomMetadata(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Keywords help organize and search your images in photo management software
                  </p>
                </div>
              </div>
            )}
          </div>

            {activeTab === "batch" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="batchMode"
                      checked={batchMode}
                      onChange={(e) => setBatchMode(e.target.checked)}
                      className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                    />
                    <Label htmlFor="batchMode" className="text-base font-medium">Enable Batch Export</Label>
                  </div>
                  {batchMode && (
                    <div className="text-sm text-gray-400">
                      {selectedImages.length} images selected
                    </div>
                  )}
                </div>

                {batchMode ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-ocean-teal/10 rounded-lg border border-ocean-teal/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Layers" className="w-4 h-4 text-ocean-teal" />
                        <span className="font-medium text-ocean-teal">Batch Processing</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Apply the same export settings to multiple images. All selected images will use the current format, quality, and metadata settings.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Available Images</Label>
                      <div className="max-h-48 overflow-y-auto border border-slate-dark rounded-lg">
                        {/* Mock images for demonstration */}
                        {[
                          { id: 1, name: "coral_reef_001.jpg", size: "3.2 MB" },
                          { id: 2, name: "sea_turtle_macro.jpg", size: "2.8 MB" },
                          { id: 3, name: "underwater_cave.jpg", size: "4.1 MB" },
                          { id: 4, name: "fish_school.jpg", size: "2.5 MB" },
                          { id: 5, name: "dive_buddy_portrait.jpg", size: "3.7 MB" }
                        ].map((mockImage) => (
                          <div
                            key={mockImage.id}
                            className="flex items-center space-x-3 p-3 hover:bg-slate-darker transition-colors border-b border-slate-dark last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(mockImage.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedImages(prev => [...prev, mockImage.id]);
                                } else {
                                  setSelectedImages(prev => prev.filter(id => id !== mockImage.id));
                                }
                              }}
                              className="w-4 h-4 text-ocean-teal bg-slate-darker border-slate-dark rounded focus:ring-ocean-teal"
                            />
                            <div className="w-10 h-10 bg-slate-dark rounded flex items-center justify-center">
                              <ApperIcon name="Image" className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">{mockImage.name}</div>
                              <div className="text-xs text-gray-400">{mockImage.size}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => setSelectedImages([1, 2, 3, 4, 5])}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => setSelectedImages([])}
                      >
                        Select None
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="Layers" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Enable batch mode to process multiple images with the same settings</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-slate-dark">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              className="flex-1"
              disabled={isExporting || (batchMode && selectedImages.length === 0)}
            >
              {isExporting ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
Export {batchMode && selectedImages.length > 0 ? `(${selectedImages.length})` : ""}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedExportModal;