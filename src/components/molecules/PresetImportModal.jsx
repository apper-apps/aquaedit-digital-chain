import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import UploadArea from "@/components/molecules/UploadArea";
import XMPProcessor from "@/services/xmpProcessor";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const PresetImportModal = ({ isOpen, onClose, onImport, className }) => {
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [previewPreset, setPreviewPreset] = useState(null);
  const [importedPresets, setImportedPresets] = useState([]);
  
  const sampleImages = [
    { id: 'reef', name: 'Coral Reef', url: '/samples/coral_reef.jpg', type: 'shallow' },
    { id: 'open', name: 'Open Water', url: '/samples/open_water.jpg', type: 'deep' },
    { id: 'macro', name: 'Macro Shot', url: '/samples/macro_marine.jpg', type: 'macro' },
    { id: 'cave', name: 'Cave Dive', url: '/samples/cave_diving.jpg', type: 'cave' }
  ];

  const processDNGFile = async (file) => {
return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const text = new TextDecoder().decode(buffer);
        
        // Enhanced XMP metadata extraction with local adjustments support
        const xmpStart = text.indexOf('<x:xmpmeta');
const xmpEnd = text.indexOf('</x:xmpmeta>');
        
        if (xmpStart !== -1 && xmpEnd !== -1) {
          const xmpData = text.substring(xmpStart, xmpEnd + 12);
          
          // Enhanced Lightroom adjustments parsing with comprehensive parameter support
          const preset = {
            Id: Date.now(),
            name: file.name.replace('.dng', ''),
            category: 'imported',
            description: 'Imported from DNG file with XMP metadata',
            source: 'dng',
            createdAt: new Date().toISOString(),
            adjustments: {
              exposure: extractXMPValue(xmpData, 'crs:Exposure2012', 0) * 100,
              contrast: extractXMPValue(xmpData, 'crs:Contrast2012', 0),
              highlights: extractXMPValue(xmpData, 'crs:Highlights2012', 0),
              shadows: extractXMPValue(xmpData, 'crs:Shadows2012', 0),
              whites: extractXMPValue(xmpData, 'crs:Whites2012', 0),
              blacks: extractXMPValue(xmpData, 'crs:Blacks2012', 0),
              saturation: extractXMPValue(xmpData, 'crs:Saturation', 0),
              vibrance: extractXMPValue(xmpData, 'crs:Vibrance', 0),
              clarity: extractXMPValue(xmpData, 'crs:Clarity2012', 0),
              texture: extractXMPValue(xmpData, 'crs:Texture', 0),
              dehaze: extractXMPValue(xmpData, 'crs:Dehaze', 0),
              temperature: extractXMPValue(xmpData, 'crs:Temperature', 0) * 0.02,
              tint: extractXMPValue(xmpData, 'crs:Tint', 0) * 0.5,
              luminanceNoise: extractXMPValue(xmpData, 'crs:LuminanceSmoothing', 0),
              colorNoise: extractXMPValue(xmpData, 'crs:ColorNoiseReduction', 0),
              sharpening: extractXMPValue(xmpData, 'crs:SharpenAmount', 0),
              sharpenRadius: extractXMPValue(xmpData, 'crs:SharpenRadius', 1.0),
              distortion: extractXMPValue(xmpData, 'crs:LensProfileDistortionScale', 0),
              chromaticAberration: Math.max(
                Math.abs(extractXMPValue(xmpData, 'crs:ChromaticAberrationR', 0)),
                Math.abs(extractXMPValue(xmpData, 'crs:ChromaticAberrationB', 0))
              ),
              vignette: extractXMPValue(xmpData, 'crs:PostCropVignetteAmount', 0)
            },
            metadata: {
              camera: extractXMPValue(xmpData, 'tiff:Model', 'Unknown'),
              lens: extractXMPValue(xmpData, 'aux:Lens', 'Unknown'),
              creationDate: extractXMPValue(xmpData, 'xmp:CreateDate', new Date().toISOString()),
              processVersion: extractXMPValue(xmpData, 'crs:ProcessVersion', '5.0'),
              hasSettings: extractXMPValue(xmpData, 'crs:HasSettings', false),
              software: extractXMPValue(xmpData, 'xmp:CreatorTool', 'Adobe Lightroom')
            }
          };

          // Extract HSL adjustments
          const hslChannels = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'];
          const hslMapping = {
            'Red': 'hslReds', 'Orange': 'hslOranges', 'Yellow': 'hslYellows',
            'Green': 'hslGreens', 'Aqua': 'hslCyans', 'Blue': 'hslBlues',
            'Purple': 'hslPurples', 'Magenta': 'hslMagentas'
          };

          hslChannels.forEach(color => {
            const hue = extractXMPValue(xmpData, `crs:HueAdjustment${color}`, 0);
            const sat = extractXMPValue(xmpData, `crs:SaturationAdjustment${color}`, 0);
            const lum = extractXMPValue(xmpData, `crs:LuminanceAdjustment${color}`, 0);
            
            if (hue !== 0 || sat !== 0 || lum !== 0) {
              preset.adjustments[hslMapping[color]] = { hue, saturation: sat, luminance: lum };
            }
          });

          // Extract tone curve if present
          const curveMatch = xmpData.match(/crs:ToneCurve="([^"]+)"/i);
          if (curveMatch) {
            const points = curveMatch[1].split(' ').map(point => {
              const [input, output] = point.split(',').map(val => parseInt(val));
              return { x: input || 0, y: output || 0 };
            });
            if (points.length > 1) {
              preset.adjustments.masterCurve = points;
            }
          }
          
toast.success(`Successfully imported Lightroom adjustments from ${file.name}`);
          resolve(preset);
        } else {
          toast.error('No XMP metadata found in DNG file');
          resolve(null);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read DNG file');
        resolve(null);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

// Process XMP sidecar files
  const processXMPFile = async (file) => {
    try {
      const result = await XMPProcessor.processSidecarFile(file);
      const preset = {
        Id: Date.now(),
        name: file.name.replace('.xmp', ''),
        category: 'imported',
        description: 'Imported from XMP sidecar file',
        source: 'xmp',
        createdAt: new Date().toISOString(),
        adjustments: result.adjustments,
        metadata: result.metadata,
        localAdjustments: result.localAdjustments
      };
      
      toast.success(`Successfully imported XMP sidecar: ${file.name}`);
      return preset;
    } catch (error) {
      toast.error(`Failed to process XMP file: ${error.message}`);
      return null;
    }
  };

  const extractXMPValue = (xmpData, key, defaultValue) => {
    const regex = new RegExp(`${key}="([^"]*)"`, 'i');
    const match = xmpData.match(regex);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      return isNaN(value) ? match[1] : value;
    }
    return defaultValue;
  };

  const processJSONFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const presetData = JSON.parse(e.target.result);
          
          // Validate JSON structure
          if (!presetData.adjustments) {
            toast.error('Invalid preset format - missing adjustments');
            resolve(null);
            return;
          }
          
          const preset = {
            Id: Date.now(),
            name: presetData.name || file.name.replace('.json', ''),
            category: presetData.category || 'imported',
            description: presetData.description || 'Imported JSON preset',
            source: 'json',
            createdAt: new Date().toISOString(),
            ...presetData
          };
          
          resolve(preset);
        } catch (error) {
          toast.error('Invalid JSON format');
          resolve(null);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read JSON file');
        resolve(null);
      };
      
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (files) => {
    setIsImporting(true);
    setImportProgress(0);
    const processed = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setImportProgress((i / files.length) * 100);
      
      let preset = null;
      
if (file.name.toLowerCase().endsWith('.dng')) {
        preset = await processDNGFile(file);
      } else if (file.name.toLowerCase().endsWith('.xmp')) {
        preset = await processXMPFile(file);
      } else if (file.name.toLowerCase().endsWith('.json')) {
        preset = await processJSONFile(file);
      } else {
        toast.warning(`Unsupported file format: ${file.name}. Supported formats: DNG, XMP, JSON`);
        continue;
      }
      
      if (preset) {
        processed.push(preset);
      }
    }

    setImportedPresets(processed);
    setImportProgress(100);
    setIsImporting(false);
    
    if (processed.length > 0) {
      toast.success(`Successfully imported ${processed.length} preset(s)`);
      setPreviewPreset(processed[0]);
    }
  };

  const handleImportConfirm = () => {
    if (importedPresets.length > 0) {
      onImport(importedPresets);
      onClose();
      setImportedPresets([]);
      setPreviewPreset(null);
    }
  };

  const handleClose = () => {
    setImportedPresets([]);
    setPreviewPreset(null);
    setImportProgress(0);
    setIsImporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={cn("w-full max-w-6xl max-h-[90vh] overflow-hidden", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Upload" className="w-5 h-5 text-ocean-teal" />
              <span>Import Presets</span>
            </CardTitle>
            <Button variant="ghost" size="small" onClick={handleClose}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          {isImporting && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-ocean-teal">Processing files...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <div className="w-full bg-slate-darker rounded-full h-2">
                <div 
                  className="bg-ocean-teal h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {importedPresets.length === 0 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Supported Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-darker rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <ApperIcon name="FileImage" className="w-5 h-5 text-ocean-teal" />
                      <span className="font-medium text-white">DNG Presets</span>
                    </div>
<p className="text-sm text-gray-400">
                      Import Lightroom adjustments from DNG files with XMP metadata, XMP sidecar files, or JSON presets
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <div>• DNG: Camera RAW files with embedded Lightroom adjustments</div>
                      <div>• XMP: Lightroom sidecar files with develop module settings</div>
                      <div>• JSON: AquaEdit Pro preset files</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-darker rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <ApperIcon name="FileText" className="w-5 h-5 text-coral" />
                      <span className="font-medium text-white">JSON Presets</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Universal preset format with full AquaEdit Pro compatibility
                    </p>
                  </div>
                </div>
              </div>

              <UploadArea 
                onUpload={handleFileUpload}
                className="border-2 border-dashed border-ocean-teal/30 hover:border-ocean-teal/50"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Imported Presets List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Imported Presets ({importedPresets.length})</h3>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {importedPresets.map((preset, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        previewPreset?.Id === preset.Id
                          ? "border-ocean-teal bg-ocean-teal/10"
                          : "border-slate-dark bg-slate-darker hover:border-ocean-teal/50"
                      )}
                      onClick={() => setPreviewPreset(preset)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{preset.name}</div>
                          <div className="text-sm text-gray-400">{preset.description}</div>
                          <div className="text-xs text-ocean-teal mt-1">
                            Source: {preset.source.toUpperCase()}
                          </div>
                        </div>
                        <ApperIcon name="Eye" className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Panel */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Preview</h3>
                {previewPreset ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-darker rounded-lg">
                      <h4 className="font-medium text-white mb-2">{previewPreset.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{previewPreset.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Exposure:</span>
                          <span className="text-white ml-1">{previewPreset.adjustments.exposure || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Contrast:</span>
                          <span className="text-white ml-1">{previewPreset.adjustments.contrast || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Saturation:</span>
                          <span className="text-white ml-1">{previewPreset.adjustments.saturation || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Vibrance:</span>
                          <span className="text-white ml-1">{previewPreset.adjustments.vibrance || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-300">Sample Preview</span>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleImages.map((sample) => (
                          <div key={sample.id} className="relative">
                            <div className="aspect-video bg-slate-dark rounded flex items-center justify-center">
                              <ApperIcon name="Image" className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="text-xs text-center mt-1 text-gray-400">
                              {sample.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-slate-darker rounded-lg">
                    <div className="text-center">
                      <ApperIcon name="Eye" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Select a preset to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {importedPresets.length > 0 && (
            <div className="flex space-x-3 pt-4 border-t border-slate-dark">
              <Button variant="secondary" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleImportConfirm} className="flex-1">
                <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                Import {importedPresets.length} Preset{importedPresets.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PresetImportModal;