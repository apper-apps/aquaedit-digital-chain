import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PresetPanel from "@/components/organisms/PresetPanel";
import MobileNavigationTabs from "@/components/molecules/MobileNavigationTabs";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import QuickAccessSidebar from "@/components/molecules/QuickAccessSidebar";
import UploadArea from "@/components/molecules/UploadArea";
import UploadArea from "@/components/molecules/UploadArea";
import CommandPalette from "@/components/molecules/CommandPalette";
import KeyboardShortcuts from "@/components/molecules/KeyboardShortcuts";
import AdvancedExportModal from "@/components/molecules/AdvancedExportModal";
import PerformanceIndicator from "@/components/molecules/PerformanceIndicator";
import Button from "@/components/atoms/Button";
import Toolbar from "@/components/organisms/Toolbar";
import ImageCanvas from "@/components/organisms/ImageCanvas";
import AdjustmentPanel from "@/components/organisms/AdjustmentPanel";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { getImages, saveProject } from "@/services/api/projectService";
const EditorPage = () => {
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(null);
  const [adjustments, setAdjustments] = useState({
    // Basic adjustments
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    saturation: 0,
    vibrance: 0,
    warmth: 0,
    clarity: 0,
    texture: 0,
    dehaze: 0,
    
    // Enhanced HSL Selective adjustments (8-channel)
    hslReds: { hue: 0, saturation: 0, luminance: 0 },
    hslOranges: { hue: 0, saturation: 0, luminance: 0 },
    hslYellows: { hue: 0, saturation: 0, luminance: 0 },
    hslGreens: { hue: 0, saturation: 0, luminance: 0 },
    hslCyans: { hue: 0, saturation: 0, luminance: 0 },
    hslBlues: { hue: 0, saturation: 0, luminance: 0 },
    hslPurples: { hue: 0, saturation: 0, luminance: 0 },
    hslMagentas: { hue: 0, saturation: 0, luminance: 0 },
    
    // Advanced Color Targeting
    selectedColorRange: null,
    colorTolerance: 15,
    colorFeather: 10,
    eyedropperColor: null,
    
    // Underwater Enhancement Modes
    coralEnhancementMode: false,
    coralBoost: 0,
    fishColorIsolation: false,
    fishEnhancement: 0,
    waterCastCorrection: 0,
    depthCompensation: 0,
    waterClarity: 0,
    blueRemoval: 0,
    greenRemoval: 0,
    coralEnhancement: 0,
    
    // White Balance
    temperature: 0,
    tint: 0,
    
    // Advanced Tone Curves with unlimited control points
    masterCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    rgbCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    redCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    greenCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    blueCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    activeCurveChannel: 'rgb',
    
    // Curve Presets & History
    curvePreset: null,
    curveHistory: [],
    curveHistoryIndex: -1,
    curveSmoothingEnabled: true,
    showHistogram: true,
    showBeforeAfter: false,
    
    // Advanced Curve Controls
    autoContrastStrength: 50,
    shadowClipping: 0,
    highlightClipping: 0,
    midtoneContrast: 0,
    
    // Professional Masking System
    luminosityMasks: [],
    aiSubjectMasks: [],
    colorRangeMasks: [],
    edgeAwareMasks: [],
    maskGroups: [],
    activeMask: null,
    maskHistory: [],
    maskPrecision: 16, // 16-bit precision
    
    // Color Range Masking with HSV
    colorMask: null,
    maskTolerance: 20,
    maskFeather: 10,
    hueRange: 15,
    satRange: 20,
    valRange: 20,
    
    // Local Adjustments
    radialMask: null,
    linearMask: null,
    brushMask: null,
    gradientMasks: [],
    
    // AI Subject Detection
    aiSubjectMask: null,
    aiConfidence: 75,
    detectedSubjects: [],
    
    // Edge-Aware Masking
    edgeDetection: 50,
    maskFeathering: 10,
    maskRefinement: 0,
    
    // Noise Reduction & Sharpening
    luminanceNoise: 0,
    colorNoise: 0,
    sharpening: 0,
    sharpenRadius: 1,
    sharpenDetail: 0,
    sharpenMasking: 0,
    sharpenThreshold: 0,
    
    // Lens Correction
    distortion: 0,
    chromaticAberration: 0,
    vignette: 0,
    perspective: { horizontal: 0, vertical: 0 },
    lensProfileEnabled: false,
    
    // Professional Color Science
    colorSpace: 'sRGB',
    bitDepth: 8,
    colorProfile: 'sRGB IEC61966-2.1',
    underwaterProfile: 'Underwater Standard',
    gamutMapping: 'perceptual'
  });
const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Load initial data from navigation state
  useEffect(() => {
    const { uploadedFiles, project, preset } = location.state || {};
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      handleFileUpload(uploadedFiles);
    } else if (project) {
      loadProject(project);
} else if (preset) {
      applyPreset(preset);
    }
  }, [location.state]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentImage) return;
    
    const autoSaveInterval = setInterval(async () => {
      if (historyIndex >= 0) {
        await handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [currentImage, adjustments, historyIndex]);

const handleFileUpload = async (files) => {
    try {
      setLoading(true);
      setError("");
      
      if (!files || files.length === 0) {
        toast.error("No file provided");
        return;
      }
      
      // Process single file for optimal performance
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      
      // Extract actual image dimensions
      const img = new Image();
      img.onload = () => {
        const image = {
          Id: Date.now(),
          filename: file.name,
          url: imageUrl,
          uploadDate: new Date(),
          format: file.type,
          dimensions: { 
            width: img.naturalWidth, 
            height: img.naturalHeight 
          },
          metadata: {
            size: file.size,
            type: file.type,
            width: img.naturalWidth,
            height: img.naturalHeight,
            aspectRatio: img.naturalWidth / img.naturalHeight
          }
        };
        
        setCurrentImage(image);
        addToHistory(adjustments);
        toast.success(`Image loaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
      };
      
      img.onerror = () => {
        toast.error("Failed to load image. Please try a different file.");
        setLoading(false);
      };
      
      img.src = imageUrl;
    } catch (err) {
      setError("Failed to load image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async (project) => {
    try {
      setLoading(true);
      const images = await getImages();
      const projectImage = images.find(img => img.Id === project.imageId);
      
      if (projectImage) {
        setCurrentImage(projectImage);
        if (project.adjustments) {
          setAdjustments(project.adjustments);
        }
        addToHistory(project.adjustments || adjustments);
      }
    } catch (err) {
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

const applyPreset = (preset) => {
    if (preset.adjustments) {
      // Merge preset adjustments with current adjustments
      const mergedAdjustments = { ...adjustments, ...preset.adjustments };
      setAdjustments(mergedAdjustments);
      addToHistory(mergedAdjustments);
      toast.success(`Applied preset: ${preset.name}${preset.source ? ` (${preset.source.toUpperCase()})` : ''}`);
    }
  };

  const addToHistory = (newAdjustments) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...newAdjustments });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleAdjustmentChange = (key, value) => {
    const newAdjustments = { ...adjustments, [key]: value };
    setAdjustments(newAdjustments);
    
    // Debounce history updates
    setTimeout(() => {
      addToHistory(newAdjustments);
    }, 500);
  };

const handleResetAll = () => {
const resetAdjustments = {
      // Basic adjustments
      exposure: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      saturation: 0,
      vibrance: 0,
      warmth: 0,
      clarity: 0,
      texture: 0,
      dehaze: 0,
      
      // Enhanced HSL Selective adjustments (8-channel)
      hslReds: { hue: 0, saturation: 0, luminance: 0 },
      hslOranges: { hue: 0, saturation: 0, luminance: 0 },
      hslYellows: { hue: 0, saturation: 0, luminance: 0 },
      hslGreens: { hue: 0, saturation: 0, luminance: 0 },
      hslCyans: { hue: 0, saturation: 0, luminance: 0 },
      hslBlues: { hue: 0, saturation: 0, luminance: 0 },
      hslPurples: { hue: 0, saturation: 0, luminance: 0 },
      hslMagentas: { hue: 0, saturation: 0, luminance: 0 },
      
      // Advanced Color Targeting
      selectedColorRange: null,
      colorTolerance: 15,
      colorFeather: 10,
      eyedropperColor: null,
      
      // Underwater Enhancement Modes
      coralEnhancementMode: false,
      coralBoost: 0,
      fishColorIsolation: false,
      fishEnhancement: 0,
      waterCastCorrection: 0,
      depthCompensation: 0,
      waterClarity: 0,
      blueRemoval: 0,
      greenRemoval: 0,
      coralEnhancement: 0,
      
      // White Balance
      temperature: 0,
      tint: 0,
      
      // Advanced Tone Curves
      masterCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      rgbCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      redCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      greenCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      blueCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      activeCurveChannel: 'rgb',
      
      // Curve Presets & History
      curvePreset: null,
      curveHistory: [],
      curveHistoryIndex: -1,
      curveSmoothingEnabled: true,
      showHistogram: true,
      showBeforeAfter: false,
      
      // Advanced Curve Controls
      autoContrastStrength: 50,
      shadowClipping: 0,
      highlightClipping: 0,
      midtoneContrast: 0,
      
      // Professional Masking System
      luminosityMasks: [],
      aiSubjectMasks: [],
      colorRangeMasks: [],
      edgeAwareMasks: [],
      maskGroups: [],
      activeMask: null,
      maskHistory: [],
      maskPrecision: 16,
      
      // Color Range Masking
      colorMask: null,
      maskTolerance: 20,
      maskFeather: 10,
      hueRange: 15,
      satRange: 20,
      valRange: 20,
      
      // Local Adjustments
      radialMask: null,
      linearMask: null,
      brushMask: null,
      gradientMasks: [],
      
      // AI Subject Detection
      aiSubjectMask: null,
      aiConfidence: 75,
      detectedSubjects: [],
      
      // Edge-Aware Masking
      edgeDetection: 50,
      maskFeathering: 10,
      maskRefinement: 0,
      
      // Noise Reduction & Sharpening
      luminanceNoise: 0,
      colorNoise: 0,
      sharpening: 0,
      sharpenRadius: 1,
      sharpenDetail: 0,
      sharpenMasking: 0,
      sharpenThreshold: 0,
      
      // Lens Correction
      distortion: 0,
      chromaticAberration: 0,
      vignette: 0,
      perspective: { horizontal: 0, vertical: 0 },
      lensProfileEnabled: false,
      
      // Professional Color Science
      colorSpace: 'sRGB',
      bitDepth: 8,
      colorProfile: 'sRGB IEC61966-2.1',
      underwaterProfile: 'Underwater Standard',
      gamutMapping: 'perceptual'
    };
    setAdjustments(resetAdjustments);
    addToHistory(resetAdjustments);
    toast.info("All adjustments reset");
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAdjustments(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAdjustments(history[newIndex]);
    }
  };

  const handleAutoSave = async () => {
    if (!currentImage) return;
    
    try {
      setAutoSaving(true);
      await saveProject({
        name: `Auto-save ${currentImage.filename}`,
        imageId: currentImage.Id,
        adjustments,
        lastModified: new Date()
      });
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSave = async () => {
    if (!currentImage) return;
    
    try {
      await saveProject({
        name: currentImage.filename,
        imageId: currentImage.Id,
        adjustments,
        lastModified: new Date()
      });
      toast.success("Project saved successfully!");
    } catch (err) {
      toast.error("Failed to save project");
    }
  };

const handleExport = async (exportSettings) => {
    setIsProcessing(true);
    setProcessingStatus("Preparing export...");
    
    try {
      // Simulate export processing
      setProcessingStatus("Applying adjustments...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (exportSettings.watermark) {
        setProcessingStatus("Adding watermark...");
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      if (exportSettings.metadata?.custom) {
        setProcessingStatus("Embedding metadata...");
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setProcessingStatus("Finalizing export...");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const imageCount = exportSettings.batchMode ? exportSettings.selectedImages.length : 1;
      const formatStr = exportSettings.format.toUpperCase();
      
      toast.success(
        `Successfully exported ${imageCount} image${imageCount > 1 ? 's' : ''} as ${formatStr}${
          exportSettings.watermark ? ' with watermark' : ''
        }`
      );
      
      console.log("Advanced export settings:", exportSettings);
    } catch (error) {
      toast.error("Export failed. Please try again.");
      console.error("Export error:", error);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command Palette
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Keyboard Shortcuts
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      // Quick Access
      if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        setShowQuickAccess(!showQuickAccess);
      }
      // Export
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setShowAdvancedExport(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showQuickAccess]);

  if (loading) {
    return <Loading message="Loading editor..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Error 
          title="Editor Error"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

const { isDarkMode } = useTheme();
  const [activePanel, setActivePanel] = useState('develop');
  const [activeTab, setActiveTab] = useState('develop');

  // Load initial data from navigation state
  useEffect(() => {
    const { uploadedFiles, project, preset } = location.state || {};
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      handleFileUpload(uploadedFiles);
    } else if (project) {
      loadProject(project);
    } else if (preset) {
      applyPreset(preset);
    }
  }, [location.state]);

  const handlePresetSelect = (preset) => {
    const newAdjustments = { ...adjustments, ...preset.settings };
    setAdjustments(newAdjustments);
    addToHistory(newAdjustments);
    toast.success(`Applied preset: ${preset.name}`);
  };

  const handlePresetCreate = () => {
    toast.info('Preset creation coming soon!');
  };

  if (loading) {
    return <Loading message="Loading editor..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Error 
          title="Editor Error"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-darker' : 'bg-gray-50'}`}>
      {/* Auto-save indicator */}
      {autoSaving && (
        <div className="fixed top-20 right-6 bg-ocean-teal text-white px-3 py-1 rounded text-sm z-50">
          Auto-saving...
        </div>
      )}

      {/* Mobile Navigation Tabs */}
      <MobileNavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={['develop', 'presets', 'export']}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Presets/Tools */}
        <div className="w-80 border-r border-slate-dark bg-slate-dark/50">
          <div className="h-full flex flex-col">
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-dark bg-slate-dark/30">
              <button
                onClick={() => setActivePanel('develop')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === 'develop' 
                    ? 'text-ocean-teal border-b-2 border-ocean-teal bg-ocean-teal/10' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tools
              </button>
              <button
                onClick={() => setActivePanel('presets')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === 'presets' 
                    ? 'text-ocean-teal border-b-2 border-ocean-teal bg-ocean-teal/10' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Presets
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 p-4">
              {activePanel === 'develop' && (
                <Toolbar
                  onExport={() => setShowAdvancedExport(true)}
                  onSave={handleSave}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={historyIndex > 0}
                  canRedo={historyIndex < history.length - 1}
                  onQuickAccess={() => setShowQuickAccess(!showQuickAccess)}
                  onCommandPalette={() => setShowCommandPalette(true)}
                  className="w-full h-auto"
                />
              )}
              
              {activePanel === 'presets' && (
                <PresetPanel
                  onPresetSelect={handlePresetSelect}
                  onPresetCreate={handlePresetCreate}
                />
              )}
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            {currentImage ? (
              <ImageCanvas 
                image={currentImage}
                adjustments={adjustments}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <UploadArea onUpload={handleFileUpload} className="max-w-md" />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Adjustment Controls */}
        <div className="w-80 border-l border-slate-dark bg-slate-dark/50 p-4">
          <AdjustmentPanel
            adjustments={adjustments}
            onAdjustmentChange={handleAdjustmentChange}
            onResetAll={handleResetAll}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Content based on active tab */}
        {activeTab === 'develop' && (
          <div className="p-4">
            {currentImage ? (
              <ImageCanvas 
                image={currentImage}
                adjustments={adjustments}
                className="mb-4"
              />
            ) : (
              <div className="h-64 flex items-center justify-center mb-4">
                <UploadArea onUpload={handleFileUpload} className="max-w-sm" />
              </div>
            )}
            
            <AdjustmentPanel
              adjustments={adjustments}
              onAdjustmentChange={handleAdjustmentChange}
              onResetAll={handleResetAll}
            />
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="p-4">
            <PresetPanel
              onPresetSelect={handlePresetSelect}
              onPresetCreate={handlePresetCreate}
            />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="p-4">
            <div className="text-center py-8">
              <Button 
                onClick={() => setShowAdvancedExport(true)}
                size="large"
              >
                <ApperIcon name="Download" className="w-5 h-5 mr-2" />
                Export Image
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdvancedExportModal
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
        onExport={handleExport}
        image={currentImage}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      <QuickAccessSidebar
        isOpen={showQuickAccess}
        onToggle={() => setShowQuickAccess(!showQuickAccess)}
      />

      <PerformanceIndicator
        isProcessing={isProcessing}
        processingStatus={processingStatus}
      />
    </div>
  );
};

export default EditorPage;