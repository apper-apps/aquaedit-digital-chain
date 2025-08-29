import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Toolbar from "@/components/organisms/Toolbar";
import ImageCanvas from "@/components/organisms/ImageCanvas";
import AdjustmentPanel from "@/components/organisms/AdjustmentPanel";
import UploadArea from "@/components/molecules/UploadArea";
import ExportModal from "@/components/molecules/ExportModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getImages, saveProject } from "@/services/api/projectService";
import { toast } from "react-toastify";

const EditorPage = () => {
  const location = useLocation();
const [currentImage, setCurrentImage] = useState(null);
  const [adjustments, setAdjustments] = useState({
    // Basic adjustments
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    saturation: 0,
    vibrance: 0,
    warmth: 0,
    clarity: 0,
    
    // HSL Selective adjustments
    hslReds: { hue: 0, saturation: 0, luminance: 0 },
    hslOranges: { hue: 0, saturation: 0, luminance: 0 },
    hslYellows: { hue: 0, saturation: 0, luminance: 0 },
    hslGreens: { hue: 0, saturation: 0, luminance: 0 },
    hslAquas: { hue: 0, saturation: 0, luminance: 0 },
    hslBlues: { hue: 0, saturation: 0, luminance: 0 },
    hslPurples: { hue: 0, saturation: 0, luminance: 0 },
    hslMagentas: { hue: 0, saturation: 0, luminance: 0 },
    
    // White Balance
    temperature: 0,
    tint: 0,
    
    // Tone Curves
    rgbCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    redCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    greenCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    blueCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    
    // Color Range Masking
    colorMask: null,
    maskTolerance: 20,
    maskFeather: 10,
    
    // Local Adjustments
    radialMask: null,
    linearMask: null,
    brushMask: null,
    
    // Noise Reduction & Sharpening
    luminanceNoise: 0,
    colorNoise: 0,
    sharpening: 0,
    sharpenRadius: 1,
    sharpenThreshold: 0,
    
    // Lens Correction
    distortion: 0,
    chromaticAberration: 0,
    vignette: 0,
    perspective: { horizontal: 0, vertical: 0 }
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

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
      
      // Create mock image objects from uploaded files
      const file = files[0]; // Use first file for now
      const imageUrl = URL.createObjectURL(file);
      
      const image = {
        Id: Date.now(),
        filename: file.name,
        url: imageUrl,
        uploadDate: new Date(),
        format: file.type,
        dimensions: { width: 1920, height: 1080 }, // Mock dimensions
        metadata: {
          size: file.size,
          type: file.type
        }
      };
      
      setCurrentImage(image);
      addToHistory(adjustments);
      toast.success("Image loaded successfully!");
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
      setAdjustments(preset.adjustments);
      addToHistory(preset.adjustments);
      toast.success(`Applied preset: ${preset.name}`);
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
      saturation: 0,
      vibrance: 0,
      warmth: 0,
      clarity: 0,
      
      // HSL Selective adjustments
      hslReds: { hue: 0, saturation: 0, luminance: 0 },
      hslOranges: { hue: 0, saturation: 0, luminance: 0 },
      hslYellows: { hue: 0, saturation: 0, luminance: 0 },
      hslGreens: { hue: 0, saturation: 0, luminance: 0 },
      hslAquas: { hue: 0, saturation: 0, luminance: 0 },
      hslBlues: { hue: 0, saturation: 0, luminance: 0 },
      hslPurples: { hue: 0, saturation: 0, luminance: 0 },
      hslMagentas: { hue: 0, saturation: 0, luminance: 0 },
      
      // White Balance
      temperature: 0,
      tint: 0,
      
      // Tone Curves
      rgbCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      redCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      greenCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      blueCurve: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      
      // Color Range Masking
      colorMask: null,
      maskTolerance: 20,
      maskFeather: 10,
      
      // Local Adjustments
      radialMask: null,
      linearMask: null,
      brushMask: null,
      
      // Noise Reduction & Sharpening
      luminanceNoise: 0,
      colorNoise: 0,
      sharpening: 0,
      sharpenRadius: 1,
      sharpenThreshold: 0,
      
      // Lens Correction
      distortion: 0,
      chromaticAberration: 0,
      vignette: 0,
      perspective: { horizontal: 0, vertical: 0 }
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

  const handleExport = (exportSettings) => {
    // Mock export functionality
    toast.success(`Exporting ${currentImage.filename} as ${exportSettings.format.toUpperCase()}`);
    console.log("Export settings:", exportSettings);
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
    <div className="min-h-screen bg-slate-darker">
      {/* Auto-save indicator */}
      {autoSaving && (
        <div className="fixed top-20 right-6 bg-ocean-teal text-white px-3 py-1 rounded text-sm z-50">
          Auto-saving...
        </div>
      )}

      {/* Editor Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Toolbar */}
        <div className="lg:w-16 p-4">
          <Toolbar
            onExport={() => setShowExportModal(true)}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
        </div>

        {/* Center Canvas Area */}
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

        {/* Right Adjustment Panel */}
        <div className="lg:w-80 p-4">
          <AdjustmentPanel
            adjustments={adjustments}
            onAdjustmentChange={handleAdjustmentChange}
            onResetAll={handleResetAll}
          />
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        image={currentImage}
      />
    </div>
  );
};

export default EditorPage;