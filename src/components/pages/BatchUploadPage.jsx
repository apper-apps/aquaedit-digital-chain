import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import BatchPreviewGrid from "@/components/molecules/BatchPreviewGrid";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import BatchUploadModal from "@/components/molecules/BatchUploadModal";
import DuplicateDetection from "@/components/molecules/DuplicateDetection";
import SmartGrouping from "@/components/molecules/SmartGrouping";
import PresetMatcher from "@/components/molecules/PresetMatcher";
import ProcessingQueue from "@/components/molecules/ProcessingQueue";
import BreadcrumbNavigation from "@/components/molecules/BreadcrumbNavigation";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { BatchPresetService } from "@/services/batchPresetService";
import { ConditionAnalysisService } from "@/services/conditionAnalysisService";

const BatchUploadPage = () => {
  const navigate = useNavigate();
  
  // Upload State
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  
  // Processing State
  const [analyzedImages, setAnalyzedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Grouping State
  const [imageGroups, setImageGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupingCriteria, setGroupingCriteria] = useState({
    byTimestamp: true,
    byDiveSession: true,
    byLightingConditions: true,
    byDepth: false,
    bySimilarExposure: false
  });
  
  // Duplicate Detection State
  const [duplicates, setDuplicates] = useState([]);
  const [duplicateSettings, setDuplicateSettings] = useState({
    threshold: 85,
    checkMetadata: true,
    checkVisualSimilarity: true
  });
  
  // Batch Processing State
  const [batchRules, setBatchRules] = useState([]);
  const [selectedPresets, setSelectedPresets] = useState({});
  const [processingQueue, setProcessingQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState("upload");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize services
  const conditionAnalysis = new ConditionAnalysisService();
  const batchPresetService = new BatchPresetService();

  const tabs = [
    { id: "upload", name: "Upload", icon: "Upload", count: uploadedImages.length },
    { id: "analyze", name: "Analyze", icon: "Search", count: analyzedImages.length },
    { id: "group", name: "Group", icon: "Layers", count: imageGroups.length },
    { id: "duplicates", name: "Duplicates", icon: "Copy", count: duplicates.length },
    { id: "presets", name: "Presets", icon: "Palette", count: Object.keys(selectedPresets).length },
    { id: "process", name: "Process", icon: "Play", count: processingQueue.length }
  ];

  // Handle file upload
  const handleFileUpload = useCallback(async (files) => {
    if (files.length > 100) {
      toast.warning("Maximum 100 files allowed. First 100 files will be processed.");
      files = files.slice(0, 100);
    }

    setIsUploading(true);
    setUploadQueue(files);
    const progress = {};

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${file.name}_${file.lastModified}`;
        
        // Simulate upload progress
        progress[fileId] = 0;
        setUploadProgress({ ...progress });
        
        for (let p = 0; p <= 100; p += 10) {
          progress[fileId] = p;
          setUploadProgress({ ...progress });
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Create image object with metadata
        const imageUrl = URL.createObjectURL(file);
        const image = {
          Id: Date.now() + i,
          file,
          filename: file.name,
          url: imageUrl,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          metadata: await extractBasicMetadata(file),
          status: "uploaded",
          progress: 100
        };
        
        setUploadedImages(prev => [...prev, image]);
      }
      
      toast.success(`Successfully uploaded ${files.length} images`);
      setActiveTab("analyze");
    } catch (err) {
      setError("Upload failed. Please try again.");
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      setUploadQueue([]);
    }
  }, []);

  // Extract basic metadata
  const extractBasicMetadata = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          fileSize: file.size,
          lastModified: new Date(file.lastModified),
          estimatedDepth: "Unknown",
          lightingCondition: "Unknown",
          waterClarity: "Unknown"
        });
      };
      img.onerror = () => {
        resolve({
          width: 0,
          height: 0,
          aspectRatio: 1,
          fileSize: file.size,
          lastModified: new Date(file.lastModified)
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Analyze images for conditions
  const handleAnalyzeImages = async () => {
    if (uploadedImages.length === 0) {
      toast.warning("No images to analyze");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const analyzed = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];
        setAnalysisProgress((i / uploadedImages.length) * 100);
        
        // Analyze image conditions
        const analysis = await conditionAnalysis.analyzeImage(image);
        
        analyzed.push({
          ...image,
          analysis,
          status: "analyzed"
        });
        
        // Small delay for progress visualization
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setAnalyzedImages(analyzed);
      setActiveTab("group");
      toast.success(`Analyzed ${analyzed.length} images`);
    } catch (err) {
      setError("Analysis failed. Please try again.");
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  // Group images based on criteria
  const handleGroupImages = () => {
    if (analyzedImages.length === 0) {
      toast.warning("No analyzed images to group");
      return;
    }

    const groups = [];
    const ungrouped = [...analyzedImages];

    // Group by dive session (timestamp clusters)
    if (groupingCriteria.byTimestamp) {
      const timeGroups = groupByTimeStamp(ungrouped);
      groups.push(...timeGroups);
    }

    // Group by lighting conditions
    if (groupingCriteria.byLightingConditions) {
      const lightingGroups = groupByLighting(ungrouped);
      groups.push(...lightingGroups);
    }

    // Group by depth estimation
    if (groupingCriteria.byDepth) {
      const depthGroups = groupByDepth(ungrouped);
      groups.push(...depthGroups);
    }

    setImageGroups(groups);
    setActiveTab("duplicates");
    toast.success(`Created ${groups.length} image groups`);
  };

  // Group by timestamp (dive sessions)
  const groupByTimeStamp = (images) => {
    const sorted = images.sort((a, b) => new Date(a.metadata.lastModified) - new Date(b.metadata.lastModified));
    const groups = [];
    let currentGroup = [];
    let lastTime = null;

    for (const image of sorted) {
      const imageTime = new Date(image.metadata.lastModified);
      
      if (!lastTime || (imageTime - lastTime) > 30 * 60 * 1000) { // 30 minutes gap
        if (currentGroup.length > 0) {
          groups.push({
            id: `session_${groups.length + 1}`,
            name: `Dive Session ${groups.length + 1}`,
            type: "timestamp",
            images: currentGroup,
            criteria: "30+ minute gap between photos"
          });
        }
        currentGroup = [image];
      } else {
        currentGroup.push(image);
      }
      
      lastTime = imageTime;
    }
    
    if (currentGroup.length > 0) {
      groups.push({
        id: `session_${groups.length + 1}`,
        name: `Dive Session ${groups.length + 1}`,
        type: "timestamp",
        images: currentGroup,
        criteria: "30+ minute gap between photos"
      });
    }

    return groups;
  };

  // Group by lighting conditions
  const groupByLighting = (images) => {
    const lightingGroups = {};
    
    for (const image of images) {
      const lighting = image.analysis?.lightingCondition || "Unknown";
      if (!lightingGroups[lighting]) {
        lightingGroups[lighting] = [];
      }
      lightingGroups[lighting].push(image);
    }
    
    return Object.entries(lightingGroups).map(([lighting, images]) => ({
      id: `lighting_${lighting.toLowerCase()}`,
      name: `${lighting} Lighting`,
      type: "lighting",
      images,
      criteria: `Similar lighting conditions`
    }));
  };

  // Group by depth
  const groupByDepth = (images) => {
    const depthGroups = {
      surface: [],
      shallow: [],
      medium: [],
      deep: []
    };
    
    for (const image of images) {
      const depth = image.analysis?.estimatedDepth || "surface";
      if (depthGroups[depth]) {
        depthGroups[depth].push(image);
      } else {
        depthGroups.surface.push(image);
      }
    }
    
    return Object.entries(depthGroups)
      .filter(([, images]) => images.length > 0)
      .map(([depth, images]) => ({
        id: `depth_${depth}`,
        name: `${depth.charAt(0).toUpperCase() + depth.slice(1)} Water`,
        type: "depth",
        images,
        criteria: `Similar depth range`
      }));
  };

  // Detect duplicates
  const handleDetectDuplicates = async () => {
    if (analyzedImages.length === 0) {
      toast.warning("No images to check for duplicates");
      return;
    }

    setLoading(true);
    try {
      const detectedDuplicates = [];
      
      for (let i = 0; i < analyzedImages.length; i++) {
        for (let j = i + 1; j < analyzedImages.length; j++) {
          const img1 = analyzedImages[i];
          const img2 = analyzedImages[j];
          
          const similarity = calculateSimilarity(img1, img2);
          
          if (similarity >= duplicateSettings.threshold) {
            detectedDuplicates.push({
              id: `dup_${i}_${j}`,
              images: [img1, img2],
              similarity,
              reason: similarity > 95 ? "Identical files" : "Very similar content"
            });
          }
        }
      }
      
      setDuplicates(detectedDuplicates);
      setActiveTab("presets");
      toast.success(`Found ${detectedDuplicates.length} potential duplicates`);
    } catch (err) {
      toast.error("Duplicate detection failed");
    } finally {
      setLoading(false);
    }
  };

  // Calculate image similarity
  const calculateSimilarity = (img1, img2) => {
    let similarity = 0;
    
    // Check file size similarity
    const sizeDiff = Math.abs(img1.size - img2.size);
    const maxSize = Math.max(img1.size, img2.size);
    const sizeSimilarity = 100 - (sizeDiff / maxSize * 100);
    similarity += sizeSimilarity * 0.3;
    
    // Check dimension similarity
    const widthDiff = Math.abs(img1.metadata.width - img2.metadata.width);
    const heightDiff = Math.abs(img1.metadata.height - img2.metadata.height);
    const maxWidth = Math.max(img1.metadata.width, img2.metadata.width);
    const maxHeight = Math.max(img1.metadata.height, img2.metadata.height);
    const dimensionSimilarity = 100 - ((widthDiff / maxWidth + heightDiff / maxHeight) * 50);
    similarity += dimensionSimilarity * 0.3;
    
    // Check filename similarity
    const filenameSimilarity = calculateStringSimilarity(img1.filename, img2.filename);
    similarity += filenameSimilarity * 0.4;
    
    return Math.round(similarity);
  };

  // Calculate string similarity
  const calculateStringSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length * 100;
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Apply preset recommendations
  const handleApplyPresetRecommendations = async () => {
    if (analyzedImages.length === 0) {
      toast.warning("No analyzed images for preset recommendations");
      return;
    }

    setLoading(true);
    try {
      const recommendations = await batchPresetService.getRecommendations(analyzedImages);
      setSelectedPresets(recommendations);
      setActiveTab("process");
      toast.success(`Generated preset recommendations for ${Object.keys(recommendations).length} images`);
    } catch (err) {
      toast.error("Preset recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  // Start batch processing
  const handleStartProcessing = async () => {
    const imagesToProcess = analyzedImages.filter(img => selectedPresets[img.Id]);
    
    if (imagesToProcess.length === 0) {
      toast.warning("No images selected for processing");
      return;
    }

    setIsProcessing(true);
    setProcessingQueue(imagesToProcess);
    
    try {
      // Simulate batch processing
      for (let i = 0; i < imagesToProcess.length; i++) {
        const image = imagesToProcess[i];
        const preset = selectedPresets[image.Id];
        
        // Process image with preset
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update progress
        setProcessingQueue(prev => 
          prev.map(img => 
            img.Id === image.Id 
              ? { ...img, status: "processed", preset: preset.name }
              : img
          )
        );
      }
      
      toast.success(`Successfully processed ${imagesToProcess.length} images`);
      
      // Navigate to editor with processed images
      setTimeout(() => {
        navigate("/editor", { state: { processedImages: imagesToProcess } });
      }, 1000);
      
    } catch (err) {
      toast.error("Batch processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "upload":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Button 
                onClick={() => setShowUploadModal(true)}
                size="large"
                className="mb-4"
              >
                <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
                Start Batch Upload
              </Button>
              <p className="text-gray-400">
                Upload up to 100 underwater photos for intelligent batch processing
              </p>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Uploaded Images ({uploadedImages.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.Id} className="relative">
                      <img 
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-1 rounded">
                        {(image.size / (1024 * 1024)).toFixed(1)}MB
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleAnalyzeImages} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                        Analyze Conditions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case "analyze":
        return (
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="bg-slate-darker p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Analyzing underwater conditions...</span>
                  <span className="text-ocean-teal">{Math.round(analysisProgress)}%</span>
                </div>
                <div className="w-full bg-slate-dark rounded-full h-2">
                  <div 
                    className="bg-ocean-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {analyzedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Analysis Results ({analyzedImages.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analyzedImages.slice(0, 6).map((image) => (
                    <Card key={image.Id}>
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <img 
                            src={image.url}
                            alt={image.filename}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-medium text-white truncate">{image.filename}</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Water Clarity:</span>
                                <span className="text-ocean-teal">{image.analysis?.waterClarity || "Unknown"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Depth:</span>
                                <span className="text-ocean-teal">{image.analysis?.estimatedDepth || "Unknown"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Lighting:</span>
                                <span className="text-ocean-teal">{image.analysis?.lightingCondition || "Unknown"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleGroupImages}>
                    <ApperIcon name="Layers" className="w-4 h-4 mr-2" />
                    Create Smart Groups
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case "group":
        return <SmartGrouping 
          images={analyzedImages}
          groups={imageGroups}
          onGroupsChange={setImageGroups}
          criteria={groupingCriteria}
          onCriteriaChange={setGroupingCriteria}
          onNext={() => setActiveTab("duplicates")}
        />;

      case "duplicates":
        return <DuplicateDetection 
          images={analyzedImages}
          duplicates={duplicates}
          onDuplicatesChange={setDuplicates}
          settings={duplicateSettings}
          onSettingsChange={setDuplicateSettings}
          onDetect={handleDetectDuplicates}
          onNext={() => setActiveTab("presets")}
          loading={loading}
        />;

      case "presets":
        return <PresetMatcher 
          images={analyzedImages}
          selectedPresets={selectedPresets}
          onPresetsChange={setSelectedPresets}
          onApplyRecommendations={handleApplyPresetRecommendations}
          onNext={() => setActiveTab("process")}
          loading={loading}
        />;

      case "process":
        return <ProcessingQueue 
          queue={processingQueue}
          isProcessing={isProcessing}
          onStartProcessing={handleStartProcessing}
          onPauseProcessing={() => setIsProcessing(false)}
        />;

      default:
        return null;
    }
  };

  if (error) {
    return <Error message={error} onRetry={() => setError("")} />;
  }

  return (
    <div className="min-h-screen bg-slate-darker">
      {/* Breadcrumb Navigation */}
      <div className="sticky top-16 bg-slate-dark/95 backdrop-blur-sm border-b border-slate-dark z-20">
        <div className="px-6 py-3">
          <BreadcrumbNavigation />
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-ocean-gradient rounded-full">
              <ApperIcon name="Layers" className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-coral bg-clip-text text-transparent">
            Intelligent Batch Upload
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced multi-image processing system with AI-powered condition analysis and smart preset application
          </p>
        </div>

        {/* Progress Tabs */}
        <Card>
          <CardContent className="p-0">
            <div className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-6 py-4 text-center border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-ocean-teal text-ocean-teal bg-ocean-teal/5"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-slate-darker"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                    {tab.count > 0 && (
                      <span className="bg-ocean-teal text-white text-xs px-2 py-1 rounded-full min-w-[20px]">
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {index < tabs.length - 1 && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-6 bg-slate-dark"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {renderTabContent()}
        </div>

        {/* Upload Modal */}
        <BatchUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
          maxFiles={100}
        />
      </div>
    </div>
  );
};

export default BatchUploadPage;